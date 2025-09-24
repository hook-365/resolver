import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ResolverApp from './resolver'

describe('ResolverApp', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Onboarding', () => {
    it('should render onboarding screen initially', () => {
      render(<ResolverApp />)
      expect(screen.getByText('Resolver')).toBeInTheDocument()
      expect(screen.getByText('begin with demo')).toBeInTheDocument()
      expect(screen.getByText('start empty')).toBeInTheDocument()
    })

    it('should initialize with demo data when clicking begin with demo', async () => {
      render(<ResolverApp />)
      const demoButton = screen.getByText('begin with demo')

      await userEvent.click(demoButton)

      expect(screen.getByText('Your Resolver Board')).toBeInTheDocument()
      expect(screen.getByText('Work Me')).toBeInTheDocument()
      expect(screen.getByText('Parent Me')).toBeInTheDocument()
    })

    it('should initialize empty when clicking start empty', async () => {
      window.prompt.mockReturnValue('Test User')
      render(<ResolverApp />)
      const emptyButton = screen.getByText('start empty')

      await userEvent.click(emptyButton)

      expect(screen.getByText('Your Resolver Board')).toBeInTheDocument()
      expect(screen.getByText('0/3 self models')).toBeInTheDocument()
    })

    it('should not initialize if prompt is cancelled', async () => {
      window.prompt.mockReturnValue(null)
      render(<ResolverApp />)
      const emptyButton = screen.getByText('start empty')

      await userEvent.click(emptyButton)

      expect(screen.getByText('Resolver')).toBeInTheDocument() // Still on onboarding
    })
  })

  describe('Board View', () => {
    beforeEach(() => {
      localStorage.__setMockStorage({
        'resolver-app-state': JSON.stringify({
          user: 'Test User',
          selves: [
            {
              id: 1,
              name: 'Test Self',
              observations: {
                known: ['Test known'],
                knowable_1: ['Test knowable 1'],
                knowable_2: ['Test knowable 2']
              },
              authority: { name: 'Test Authority', pointsToSelf: false }
            }
          ],
          chatMessages: [],
          nextId: 2
        })
      })
    })

    it('should load saved state from localStorage', () => {
      render(<ResolverApp />)
      expect(screen.getByText('Your Resolver Board')).toBeInTheDocument()
      expect(screen.getByText('Test Self')).toBeInTheDocument()
      expect(screen.getByText('1/3 self models')).toBeInTheDocument()
    })

    it('should show Add New Self card when under limit', () => {
      render(<ResolverApp />)
      expect(screen.getByText('Add New Self')).toBeInTheDocument()
    })

    it('should allow deleting a self', async () => {
      window.confirm.mockReturnValue(true)
      render(<ResolverApp />)

      const deleteButtons = screen.getAllByRole('button').filter(btn =>
        btn.querySelector('svg') // Find buttons with Trash2 icon
      )

      await userEvent.click(deleteButtons[0])

      await waitFor(() => {
        expect(screen.getByText('0/3 self models')).toBeInTheDocument()
      })
    })

    it('should cancel deletion when user cancels confirm', async () => {
      window.confirm.mockReturnValue(false)
      render(<ResolverApp />)

      const deleteButtons = screen.getAllByRole('button').filter(btn =>
        btn.querySelector('svg')
      )

      await userEvent.click(deleteButtons[0])

      expect(screen.getByText('Test Self')).toBeInTheDocument()
      expect(screen.getByText('1/3 self models')).toBeInTheDocument()
    })

    it('should clear all data with Start Fresh button', async () => {
      window.confirm.mockReturnValue(true)
      render(<ResolverApp />)

      const startFreshButton = screen.getByText('Start Fresh')
      await userEvent.click(startFreshButton)

      expect(screen.getByText('Resolver')).toBeInTheDocument() // Back to onboarding
      expect(localStorage.getItem('resolver-app-state')).toBeNull()
    })
  })

  describe('Create Self Modal', () => {
    beforeEach(() => {
      localStorage.__setMockStorage({
        'resolver-app-state': JSON.stringify({
          user: 'Test User',
          selves: [],
          chatMessages: [],
          nextId: 1
        })
      })
    })

    it('should open modal when clicking Add New Self', async () => {
      render(<ResolverApp />)

      const addNewSelfCard = screen.getByText('Add New Self')
      await userEvent.click(addNewSelfCard.parentElement)

      expect(screen.getByText('Create New Self')).toBeInTheDocument()
      expect(screen.getByLabelText('Self Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Authority Source')).toBeInTheDocument()
    })

    it('should validate required fields', async () => {
      render(<ResolverApp />)

      const addNewSelfCard = screen.getByText('Add New Self')
      await userEvent.click(addNewSelfCard.parentElement)

      const createButton = screen.getByRole('button', { name: 'Create Self' })
      await userEvent.click(createButton)

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText('Name cannot be empty')).toBeInTheDocument()
        expect(screen.getByText('Authority name cannot be empty')).toBeInTheDocument()
      })
    })

    it('should create a new self with valid data', async () => {
      render(<ResolverApp />)

      const addNewSelfCard = screen.getByText('Add New Self')
      await userEvent.click(addNewSelfCard.parentElement)

      const nameInput = screen.getByLabelText('Self Name')
      const authorityInput = screen.getByLabelText('Authority Source')
      const selfDirectedCheckbox = screen.getByLabelText(/self-directed/i)

      await userEvent.type(nameInput, 'New Test Self')
      await userEvent.type(authorityInput, 'Test Authority')
      await userEvent.click(selfDirectedCheckbox)

      const createButton = screen.getByRole('button', { name: 'Create Self' })
      await userEvent.click(createButton)

      expect(screen.getByText('New Test Self')).toBeInTheDocument()
      expect(screen.getByText('1/3 self models')).toBeInTheDocument()
    })

    it('should close modal on cancel', async () => {
      render(<ResolverApp />)

      const addNewSelfCard = screen.getByText('Add New Self')
      await userEvent.click(addNewSelfCard.parentElement)

      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      await userEvent.click(cancelButton)

      expect(screen.queryByText('Create New Self')).not.toBeInTheDocument()
    })
  })

  describe('Focus View', () => {
    beforeEach(() => {
      localStorage.__setMockStorage({
        'resolver-app-state': JSON.stringify({
          user: 'Test User',
          selves: [
            {
              id: 1,
              name: 'Focus Test Self',
              observations: {
                known: ['Known observation'],
                knowable_1: ['Knowable A observation'],
                knowable_2: ['Knowable B observation']
              },
              authority: { name: 'Test Authority', pointsToSelf: false }
            }
          ],
          chatMessages: [],
          nextId: 2
        })
      })
    })

    it('should enter focus view when clicking a self card', async () => {
      render(<ResolverApp />)

      const selfCard = screen.getByText('Focus Test Self')
      await userEvent.click(selfCard)

      expect(screen.getByText('Exit Focus')).toBeInTheDocument()
      expect(screen.getByText('Known observation')).toBeInTheDocument()
      expect(screen.getByText('Knowable A observation')).toBeInTheDocument()
      expect(screen.getByText('Knowable B observation')).toBeInTheDocument()
    })

    it('should exit focus view', async () => {
      render(<ResolverApp />)

      const selfCard = screen.getByText('Focus Test Self')
      await userEvent.click(selfCard)

      const exitButton = screen.getByText('Exit Focus')
      await userEvent.click(exitButton)

      expect(screen.getByText('Your Resolver Board')).toBeInTheDocument()
    })

    it('should add new observations', async () => {
      window.prompt.mockReturnValue('New observation text')
      render(<ResolverApp />)

      const selfCard = screen.getByText('Focus Test Self')
      await userEvent.click(selfCard)

      const addButtons = screen.getAllByText('Add')
      await userEvent.click(addButtons[0]) // Add to Known

      expect(screen.getByText('New observation text')).toBeInTheDocument()
    })

    it('should validate observation input', async () => {
      window.prompt.mockReturnValue('') // Empty observation
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

      render(<ResolverApp />)

      const selfCard = screen.getByText('Focus Test Self')
      await userEvent.click(selfCard)

      const addButtons = screen.getAllByText('Add')
      await userEvent.click(addButtons[0])

      expect(alertSpy).toHaveBeenCalledWith('Observation cannot be empty')
    })
  })

  describe('localStorage persistence', () => {
    it('should save state to localStorage on changes', async () => {
      render(<ResolverApp />)

      // Initialize with demo
      const demoButton = screen.getByText('begin with demo')
      await userEvent.click(demoButton)

      const savedState = JSON.parse(localStorage.getItem('resolver-app-state'))
      expect(savedState.user).toBe('Demo User')
      expect(savedState.selves).toHaveLength(2)
      expect(savedState.selves[0].name).toBe('Work Me')
    })

    it('should persist nextId correctly', async () => {
      localStorage.__setMockStorage({
        'resolver-app-state': JSON.stringify({
          user: 'Test User',
          selves: [],
          chatMessages: [],
          nextId: 5
        })
      })

      render(<ResolverApp />)

      // Create a new self
      const addNewSelfCard = screen.getByText('Add New Self')
      await userEvent.click(addNewSelfCard.parentElement)

      const nameInput = screen.getByLabelText('Self Name')
      const authorityInput = screen.getByLabelText('Authority Source')

      await userEvent.type(nameInput, 'Test Self')
      await userEvent.type(authorityInput, 'Test Authority')

      const createButton = screen.getByRole('button', { name: 'Create Self' })
      await userEvent.click(createButton)

      const savedState = JSON.parse(localStorage.getItem('resolver-app-state'))
      expect(savedState.nextId).toBe(6)
      expect(savedState.selves[0].id).toBe(5)
    })
  })
})