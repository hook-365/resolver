import React, { useState, useEffect } from 'react';
import { Plus, X, User, Brain, Trash2, Edit2, Save, AlertCircle, StickyNote, Palette, Sun, Moon, Eye, HelpCircle } from 'lucide-react';
import {
  validateSelfName,
  validateAuthorityName,
  validateObservation,
  validateUserName,
  canAddMoreSelves,
  sanitizeInput
} from '../utils/validation';

const STORAGE_KEY = 'resolver-app-state';

const ResolverApp = () => {
  // Load initial state from localStorage or use defaults
  const loadInitialState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          user: parsed.user || null,
          selves: parsed.selves || [],
          notes: parsed.notes || '',
          nextId: parsed.nextId || 3,
          theme: parsed.theme || 'light'
        };
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
    }
    return { user: null, selves: [], notes: '', nextId: 3, theme: 'light' };
  };

  const initialState = loadInitialState();

  const [user, setUser] = useState(initialState.user);
  const [selves, setSelves] = useState(initialState.selves);
  const [focusedSelf, setFocusedSelf] = useState(null);
  const [notes, setNotes] = useState(initialState.notes);
  const [editingNotes, setEditingNotes] = useState(false);
  const [theme, setTheme] = useState(initialState.theme);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSelf, setEditingSelf] = useState(null);
  const [editingAuthority, setEditingAuthority] = useState(null);
  const [nextId, setNextId] = useState(initialState.nextId);
  const [showUserNameModal, setShowUserNameModal] = useState(false);
  const [showObservationModal, setShowObservationModal] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [tutorialMode, setTutorialMode] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  // Auto-save to localStorage whenever state changes
  useEffect(() => {
    const stateToSave = {
      user,
      selves,
      notes,
      nextId,
      theme
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }, [user, selves, notes, nextId, theme]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark', 'colorblind');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
    if (theme === 'colorblind') {
      document.documentElement.classList.add('colorblind');
    }
  }, [theme]);

  // Sample data to show the concept
  const sampleSelves = [
    {
      id: 1,
      name: "Work Me",
      observations: {
        known: ["I need to deliver on deadlines", "I'm good at technical problem-solving"],
        knowable_1: ["My team respects my input", "I could get promoted"],
        knowable_2: ["I might burn out", "Work-life balance is achievable"]
      },
      authority: { name: "My Manager", pointsToSelf: false }
    },
    {
      id: 2,
      name: "Parent Me",
      observations: {
        known: ["Kids need consistent attention", "I want to be present"],
        knowable_1: ["I'm a good dad", "Quality time matters most"],
        knowable_2: ["I sometimes feel guilty", "My kids will understand"]
      },
      authority: { name: "My Values", pointsToSelf: true }
    }
  ];

  const initializeDemo = () => {
    setUser("Demo User");
    setSelves(sampleSelves);
    setNotes(`# My Resolver Notes\n\nWelcome to your personal reflection space. Use this area to:\n\n- **Track insights** about your different selves\n- *Explore patterns* you notice\n- Create lists of observations\n- Write freely about your discoveries\n\n## Quick Tips\n1. Use **bold** for emphasis\n2. Use *italics* for subtle notes\n3. Create lists with - or 1.\n4. Add headers with #\n\nYour notes are automatically saved.`);
  };

  const initializeEmpty = () => {
    setShowUserNameModal(true);
  };

  const initializeTutorial = () => {
    // Start with a focused example of "Work Me"
    const tutorialSelf = {
      id: 1,
      name: "Work Me",
      observations: {
        known: [],
        knowable_1: [],
        knowable_2: []
      },
      authority: { name: "", pointsToSelf: false }
    };
    setUser("Tutorial User");
    setSelves([tutorialSelf]);
    setFocusedSelf(tutorialSelf); // Auto-focus on the Work Me self
    setTutorialMode(true);
    setTutorialStep(1); // Start at step 1 (which is now the Known section)
    setNotes('');
  };

  const handleUserNameSubmit = (name) => {
    const validation = validateUserName(name);
    if (validation.isValid) {
      setUser(validation.value);
      setSelves([]);
      setNotes('');
      setShowUserNameModal(false);
      return true;
    }
    return validation.error;
  };

  const createSelf = (selfData) => {
    const newSelf = {
      id: nextId,
      name: selfData.name,
      observations: {
        known: [],
        knowable_1: [],
        knowable_2: []
      },
      authority: { 
        name: selfData.authorityName, 
        pointsToSelf: selfData.pointsToSelf 
      }
    };
    setSelves([...selves, newSelf]);
    setNextId(nextId + 1);
    setShowCreateModal(false);
  };

  const deleteSelf = (selfId) => {
    setShowDeleteConfirm(selfId);
  };

  const confirmDeleteSelf = (selfId) => {
    setSelves(selves.filter(self => self.id !== selfId));
    if (focusedSelf && focusedSelf.id === selfId) {
      setFocusedSelf(null);
    }
    setShowDeleteConfirm(null);
  };

  const updateSelfName = (selfId, newName) => {
    const validation = validateSelfName(newName);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    const updatedSelves = selves.map(self =>
      self.id === selfId ? { ...self, name: sanitizeInput(validation.value) } : self
    );
    setSelves(updatedSelves);
    if (focusedSelf && focusedSelf.id === selfId) {
      setFocusedSelf(updatedSelves.find(s => s.id === selfId));
    }
    setEditingSelf(null);
  };

  const updateAuthority = (selfId, authorityName, pointsToSelf) => {
    const validation = validateAuthorityName(authorityName);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    const updatedSelves = selves.map(self =>
      self.id === selfId
        ? { ...self, authority: { name: sanitizeInput(validation.value), pointsToSelf } }
        : self
    );
    setSelves(updatedSelves);
    if (focusedSelf && focusedSelf.id === selfId) {
      setFocusedSelf(updatedSelves.find(s => s.id === selfId));
    }
    setEditingAuthority(null);
  };

  const focusOnSelf = (selfModel) => {
    setFocusedSelf(selfModel);
  };

  const exitFocus = () => {
    setFocusedSelf(null);
  };

  const addObservation = (category, text) => {
    if (!focusedSelf) return;

    const validation = validateObservation(text);
    if (!validation.isValid) {
      return validation.error;
    }

    const updatedSelves = selves.map(self => {
      if (self.id === focusedSelf.id) {
        return {
          ...self,
          observations: {
            ...self.observations,
            [category]: [...self.observations[category], sanitizeInput(validation.value)]
          }
        };
      }
      return self;
    });
    setSelves(updatedSelves);
    setFocusedSelf(updatedSelves.find(s => s.id === focusedSelf.id));
    return true;
  };

  const removeObservation = (category, index) => {
    if (!focusedSelf) return;
    
    const updatedSelves = selves.map(self => {
      if (self.id === focusedSelf.id) {
        const newObservations = [...self.observations[category]];
        newObservations.splice(index, 1);
        return {
          ...self,
          observations: {
            ...self.observations,
            [category]: newObservations
          }
        };
      }
      return self;
    });
    setSelves(updatedSelves);
    setFocusedSelf(updatedSelves.find(s => s.id === focusedSelf.id));
  };

  const CreateSelfModal = () => {
    const [name, setName] = useState('');
    const [authorityName, setAuthorityName] = useState('');
    const [pointsToSelf, setPointsToSelf] = useState(false);
    const [errors, setErrors] = useState({ name: '', authority: '' });

    const handleSubmit = (e) => {
      e.preventDefault();

      const nameValidation = validateSelfName(name);

      // Only validate authority name if not self-directed
      let authorityValidation = { isValid: true, value: '' };
      if (!pointsToSelf) {
        authorityValidation = validateAuthorityName(authorityName);
      }

      if (!nameValidation.isValid || !authorityValidation.isValid) {
        setErrors({
          name: nameValidation.error || '',
          authority: authorityValidation.error || ''
        });
        return;
      }

      createSelf({
        name: sanitizeInput(nameValidation.value),
        authorityName: pointsToSelf ? 'Self' : sanitizeInput(authorityValidation.value),
        pointsToSelf
      });
      setName('');
      setAuthorityName('');
      setPointsToSelf(false);
      setErrors({ name: '', authority: '' });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Create New Self</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="selfName" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Self Name</label>
              <input
                id="selfName"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors({ ...errors, name: '' });
                }}
                className={`w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${errors.name ? 'border-red-500' : ''}`}
                placeholder="e.g., Work Me, Parent Me, Creative Me"
                maxLength="50"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="authoritySource" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Authority Source {!pointsToSelf && <span className="text-red-500">*</span>}</label>
              <input
                id="authoritySource"
                type="text"
                value={authorityName}
                onChange={(e) => {
                  setAuthorityName(e.target.value);
                  setErrors({ ...errors, authority: '' });
                }}
                className={`w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${errors.authority ? 'border-red-500' : ''} ${pointsToSelf ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                disabled={pointsToSelf}
                placeholder={pointsToSelf ? "Self-directed (no external authority)" : "e.g., My Manager, My Values, Society"}
                maxLength="50"
              />
              {errors.authority && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.authority}
                </p>
              )}
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pointsToSelf"
                checked={pointsToSelf}
                onChange={(e) => setPointsToSelf(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="pointsToSelf" className="text-sm text-gray-700 dark:text-gray-300">
                This self is self-directed (authority points to self)
              </label>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Create Self
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Modal for user name input
  const UserNameModal = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      const result = handleUserNameSubmit(name);
      if (result === true) {
        setName('');
        setError('');
      } else {
        setError(result);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-bold mb-4 dark:text-white">What's your name?</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                className={`w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 ${error ? 'border-red-500' : ''}`}
                placeholder="Enter your name"
                maxLength="100"
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  {error}
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowUserNameModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Modal for adding observations
  const ObservationModal = () => {
    const [text, setText] = useState('');
    const [error, setError] = useState('');
    const { category, title } = showObservationModal || {};

    const handleSubmit = (e) => {
      e.preventDefault();
      const result = addObservation(category, text);
      if (result === true) {
        setText('');
        setError('');
        setShowObservationModal(null);
      } else {
        setError(result);
      }
    };

    if (!showObservationModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Add {title}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setError('');
                }}
                className={`w-full border rounded px-3 py-2 h-24 ${error ? 'border-red-500' : ''}`}
                placeholder={`Enter your ${title.toLowerCase()} observation...`}
                maxLength="500"
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  {error}
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowObservationModal(null)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Modal for delete confirmation
  const DeleteConfirmModal = () => {
    const selfToDelete = selves.find(s => s.id === showDeleteConfirm);

    if (!showDeleteConfirm || !selfToDelete) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Delete "{selfToDelete.name}"?</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Are you sure you want to delete this self? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowDeleteConfirm(null)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => confirmDeleteSelf(showDeleteConfirm)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Modal for reset confirmation
  const ResetConfirmModal = () => {
    if (!showResetConfirm) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Start Fresh?</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This will clear all your data and start fresh. Your selves, observations, and all saved information will be permanently deleted.
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY);
                setUser(null);
                setSelves([]);
                setNotes('');
                setNextId(3);
                setTheme('light');
                setShowResetConfirm(false);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear All Data
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Helper function to get tutorial highlight styles
  const getTutorialHighlight = (section) => {
    if (!tutorialMode) return '';

    const tutorialSteps = [
      { step: 1, highlight: "known-section" },
      { step: 2, highlight: "knowable-1-section" },
      { step: 3, highlight: "knowable-2-section" },
      { step: 4, highlight: "authority-section" },
      { step: 5, highlight: "full-self" },
      { step: 6, highlight: "exit-button" }
    ];

    const currentStep = tutorialSteps.find(s => s.step === tutorialStep);
    if (currentStep && currentStep.highlight === section) {
      // Use a more prominent highlight that stands out even in high contrast mode
      return theme === 'colorblind'
        ? 'ring-4 ring-green-500 ring-offset-4 animate-pulse shadow-2xl shadow-green-500/50'
        : 'ring-4 ring-green-500 ring-offset-2 animate-pulse shadow-xl shadow-green-500/30';
    }
    return '';
  };

  // Tutorial Overlay Component
  const TutorialOverlay = () => {
    // Check which self we're working with
    const isSocialMe = focusedSelf?.name === "Social Me";

    const tutorialSteps = isSocialMe ? [
      {
        step: 1,
        title: "What You Know For Sure",
        content: "Think about your social self - who you are with friends. What do you know for certain about yourself in social settings? These are your core truths about how you connect with others.",
        action: "Add what you know about your social self",
        example: ["I genuinely care about my friends", "I need alone time to recharge", "I'm a good listener", "I prefer small groups over large parties", "I remember people's birthdays", "I avoid conflict even when necessary", "I value loyalty above most things"],
        highlight: "known-section"
      },
      {
        step: 2,
        title: "Things You're Starting to Notice",
        content: "What are you beginning to realize about your friendships and social life? These are insights emerging about how you relate to others - things you're starting to see but haven't fully accepted.",
        action: "Add emerging social insights",
        example: ["Maybe I give more than I receive", "People seem to trust me with secrets", "I might be avoiding deeper connections", "I'm attracted to people who need help", "My humor is a shield sometimes", "I feel drained after certain friendships", "I'm becoming more selective with my time"],
        highlight: "knowable-1-section"
      },
      {
        step: 3,
        title: "The Deeper Shifts",
        content: "What could fundamentally change how you see your social self? These are the big 'what ifs' about your relationships and social identity that could transform everything.",
        action: "Add transformative social possibilities",
        example: ["What if I don't need everyone to like me?", "What if vulnerability is strength?", "What if I've outgrown some friendships?", "What if quality matters more than quantity?", "What if saying no is actually kind?", "What if my boundaries are gifts?", "What if I'm already enough as I am?"],
        highlight: "knowable-2-section"
      },
      {
        step: 4,
        title: "Who Validates Your Social Self?",
        content: "In social settings, what tells you you're being a good friend or person? Is it your friends' reactions, social media, or your own sense of connection? Is this validation internal or external?",
        action: "Name your social authority & check 'self-directed' if internal",
        example: ["Friends' acceptance (external)", "Social expectations (external)", "My own values about friendship (internal)", "Instagram likes (external)", "Family opinions (external)", "My gut feeling (internal)", "Community standards (external)"],
        highlight: "authority-section"
      },
      {
        step: 5,
        title: "How It All Works Together",
        content: "Notice how your social self seeks validation? If it's external (friends' approval), you might change yourself to fit in. If internal (your values), you stay true even when it's uncomfortable. This shapes all your relationships.",
        action: "See how authority affects your social interactions",
        highlight: "full-self"
      },
      {
        step: 6,
        title: "You've Mapped Two Selves!",
        content: "Amazing! Notice how different Work Me and Social Me are? Different truths, different authorities. You might be confident at work but insecure socially, or vice versa. This is the power of mapping multiple selves.",
        action: "Tutorial complete! Explore your selves",
        highlight: "exit-button"
      }
    ] : [
      {
        step: 1,
        title: "What You Know For Sure",
        content: "Let's start with what feels solid and true about your work self. What do you know about yourself at work? These are the things you're confident about - your core understanding of who you are professionally.",
        action: "Add a few things you know about yourself at work",
        example: ["I care about doing good work", "I'm good at solving problems", "I value being reliable", "I work better in the morning", "I'm detail-oriented", "I prefer clear deadlines", "I take pride in my expertise"],
        highlight: "known-section"
      },
      {
        step: 2,
        title: "Things You're Starting to Notice",
        content: "Knowable A is like your peripheral vision - things you're beginning to see but haven't fully looked at yet. These are observations that feel true but you haven't fully owned them. They're moving from unknown toward known.",
        action: "Add things you're beginning to notice",
        example: ["I might be taking on too much", "My team seems to trust me", "This role is changing me", "I say yes when I should say no", "My best ideas come outside meetings", "I'm outgrowing this position", "I work to avoid conflict"],
        highlight: "knowable-1-section"
      },
      {
        step: 3,
        title: "The Deeper Shifts",
        content: "Knowable B goes deeper - these are fundamental shifts that could rewrite your story. While Knowable A is 'what's emerging', Knowable B is 'what could transform everything'. The Unknown (that empty gray box) stays empty - it represents what you can't even imagine yet.",
        action: "Add potential transformations",
        example: ["What if my worth isn't tied to productivity?", "What if I'm in the wrong field?", "What if success looks completely different?", "What if work-life balance is possible?", "What if I could lead differently?", "What if my skills transfer elsewhere?", "What if less effort yields more?"],
        highlight: "knowable-2-section"
      },
      {
        step: 4,
        title: "Who Validates This Self?",
        content: "Every self needs validation. At work, who or what tells you you're doing okay - your boss, your standards, or yourself? Then decide: is this internal (you validate yourself) or external (you need outside approval)?",
        action: "Name your authority & check 'self-directed' if it's internal",
        example: ["Manager's approval (external)", "My own standards (internal)", "Team feedback (external)", "Performance reviews (external)", "Industry standards (external)", "My sense of craft (internal)", "Company values (external)"],
        highlight: "authority-section"
      },
      {
        step: 5,
        title: "How It All Works Together",
        content: "Here's the key insight: When what you 'know' isn't enough (like when you face a challenge), you turn to your authority for help. If it's external, you wait for validation. If it's internal, you validate yourself. This tension between self and authority drives all your growth.",
        action: "Notice how your authority influences what moves from Knowable to Known",
        highlight: "full-self"
      },
      {
        step: 6,
        title: "You've Mapped One Self!",
        content: "Great job! You can create up to 3 different selves (Work Me, Parent Me, Friend Me, etc.). Each has its own Known/Knowable areas and authority. The magic happens when you see how differently each self operates. Ready to explore more?",
        action: "Click 'Exit Focus' to complete or try 'Social Me' example",
        highlight: "exit-button"
      }
    ];

    const currentStepData = tutorialSteps.find(s => s.step === tutorialStep);

    if (!tutorialMode || !currentStepData || tutorialStep === 0) return null;

    // Determine position based on what's being highlighted
    // Steps 1 (Known) and 2 (Knowable A) are on left side of grid, so panel goes right
    // Step 3 (Knowable B) is on right side of grid, so panel goes left
    // Step 4 (Authority) should be bottom-center and narrower to not block buttons
    // Steps 5+ should be on left
    let positionClass;
    let widthClass = "w-72"; // default width

    if (tutorialStep === 1 || tutorialStep === 2) {
      positionClass = "top-20 right-4";  // Known and Knowable A - panel on right
    } else if (tutorialStep === 4) {
      positionClass = "bottom-4 left-1/2 transform -translate-x-1/2";  // Authority step - centered at bottom
      widthClass = "w-64"; // narrower for step 4
    } else {
      positionClass = "top-20 left-4";  // Everything else - panel on left
    }

    return (
      <>
        {/* Tutorial guide panel - positioned dynamically */}
        <div className={`fixed ${positionClass} ${widthClass} bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 z-30 border-2 border-green-500`}>
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-sm font-bold text-green-600 dark:text-green-400">
              Step {tutorialStep}/6: {currentStepData.title}
            </h3>
            <button
              onClick={() => {
                setTutorialMode(false);
                setTutorialStep(0);
              }}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            {currentStepData.content}
          </p>

          {currentStepData.example && Array.isArray(currentStepData.example) && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 mb-4">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Examples:</p>
              <ul className="text-xs text-gray-700 dark:text-gray-200 space-y-1">
                {currentStepData.example.map((ex, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-green-50 dark:bg-green-900/20 rounded p-3 mb-4">
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              👉 {currentStepData.action}
            </p>
          </div>

          <div className="flex justify-between">
            {tutorialStep > 1 && (
              <button
                onClick={() => setTutorialStep(tutorialStep - 1)}
                className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Previous
              </button>
            )}
            {tutorialStep < 6 && (
              <button
                onClick={() => setTutorialStep(tutorialStep + 1)}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 ml-auto"
              >
                Next Step
              </button>
            )}
            {tutorialStep === 6 && (
              <div className="flex gap-2 ml-auto">
                {!isSocialMe && (
                  <button
                    onClick={() => {
                      // Start Social Me tutorial
                      const socialSelf = {
                        id: 2,
                        name: "Social Me",
                        observations: {
                          known: [],
                          knowable_1: [],
                          knowable_2: []
                        },
                        authority: { name: "", pointsToSelf: false }
                      };
                      setSelves(prev => [...prev, socialSelf]);
                      setFocusedSelf(socialSelf);
                      setTutorialStep(1);
                    }}
                    className="px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Try Social Me
                  </button>
                )}
                <button
                  onClick={() => {
                    setTutorialMode(false);
                    setTutorialStep(0);
                  }}
                  className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Finish
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  // Theme Switcher Component
  const ThemeSwitcher = () => {
    const themes = [
      { id: 'light', name: 'Light', icon: Sun, colors: 'Default light theme' },
      { id: 'dark', name: 'Dark', icon: Moon, colors: 'Dark mode for low light' },
      { id: 'colorblind', name: 'High Contrast', icon: Eye, colors: 'Enhanced visibility with symbols' }
    ];

    return (
      <div className="relative">
        <button
          onClick={() => setShowThemeMenu(!showThemeMenu)}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="Change theme"
        >
          <Palette size={20} className="text-gray-600 dark:text-gray-300" />
        </button>

        {showThemeMenu && (
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-50">
            <div className="p-2">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-2 mb-2">Theme</h4>
              {themes.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setShowThemeMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      theme === t.id ? 'bg-indigo-50 dark:bg-indigo-900' : ''
                    }`}
                  >
                    <Icon size={16} />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{t.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{t.colors}</div>
                    </div>
                    {theme === t.id && (
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Privacy Footer Component
  const PrivacyFooter = () => {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 py-2 px-4 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>
            Your data never leaves your browser. All information is stored locally on your device. No servers, no tracking, completely private.
          </span>
        </div>
      </div>
    );
  };

  // Tooltip Component
  const Tooltip = ({ text }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <div className="relative inline-block ml-1">
        <button
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          type="button"
        >
          <HelpCircle size={14} />
        </button>
        {showTooltip && (
          <div className="absolute z-50 w-48 p-2 text-xs bg-gray-900 text-white rounded-lg shadow-lg -top-2 left-6 pointer-events-none">
            <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -left-1 top-3"></div>
            {text}
          </div>
        )}
      </div>
    );
  };

  const ObservationCard = ({ title, observations, category, color, highlightClass = '' }) => {
    // Help text for each section
    const helpText = {
      'known': 'What you currently understand about this self. Your established truths and core beliefs.',
      'knowable_1': 'Emerging insights. Things moving from unconscious to conscious awareness.',
      'knowable_2': 'Deeper possibilities. Transformative realizations that could change everything.',
    };

    // Theme-aware color mapping
    const colorMap = {
      light: {
        'knowable_1': 'bg-green-200',
        'knowable_2': 'bg-yellow-200',
        'known': 'bg-blue-200'
      },
      dark: {
        'knowable_1': 'bg-gradient-to-br from-emerald-600 to-teal-700',
        'knowable_2': 'bg-gradient-to-br from-amber-600 to-orange-700',
        'known': 'bg-gradient-to-br from-blue-600 to-indigo-700'
      },
      colorblind: {
        'knowable_1': 'bg-blue-100 border-2 border-blue-700',
        'knowable_2': 'bg-amber-100 border-2 border-amber-700',
        'known': 'bg-slate-100 border-2 border-slate-700'
      }
    };

    const themeColor = colorMap[theme]?.[category] || color;

    // Add symbols for colorblind mode
    const getSymbol = () => {
      if (theme !== 'colorblind') return null;
      const symbols = {
        'known': '■', // Solid square for Known
        'knowable_1': '◆', // Diamond for Knowable A
        'knowable_2': '●', // Circle for Knowable B
      };
      return symbols[category] || '';
    };

    return (
    <div className={`${themeColor} p-4 rounded-lg ${highlightClass}`}>
      <h4 className="font-medium mb-2 text-sm flex items-center text-gray-900 dark:text-white">
        {theme === 'colorblind' && (
          <span className="mr-2 text-lg font-bold">{getSymbol()}</span>
        )}
        {title}
        <Tooltip text={helpText[category]} />
      </h4>
      <div className="space-y-1">
        {observations.map((obs, idx) => (
          <div key={idx} className={`flex items-start justify-between p-2 rounded text-xs ${
            theme === 'colorblind'
              ? 'bg-white border-l-4 border-gray-700 text-gray-900 font-medium'
              : 'bg-white/30 dark:bg-gray-800/70 text-gray-800 dark:text-gray-100'
          }`}>
            <span className="flex-1">{obs}</span>
            {focusedSelf && (
              <button
                onClick={() => removeObservation(category, idx)}
                className="ml-2 text-red-600 hover:text-red-800"
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}
        {focusedSelf && (
          <button
            onClick={() => setShowObservationModal({ category, title })}
            className="w-full bg-white/30 dark:bg-gray-700/30 hover:bg-white/40 dark:hover:bg-gray-700/40 p-2 rounded text-xs flex items-center justify-center dark:text-gray-300"
          >
            <Plus size={12} className="mr-1" /> Add
          </button>
        )}
      </div>
    </div>
  );
  };

  // Onboarding screen
  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md text-center relative">
            <Brain className="mx-auto mb-4 text-indigo-600" size={48} />
            <h1 className="text-2xl font-bold mb-4 dark:text-white">Resolver</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
              A tool for coming home to yourself so thoroughly that others can find you there too.
            </p>

            {/* Text-based theme toggle */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setTheme('light')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    theme === 'light'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    theme === 'dark'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Dark
                </button>
                <button
                  onClick={() => setTheme('colorblind')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    theme === 'colorblind'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  High Contrast
                </button>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
              Based on the <a href="https://www.isaacbowen.com/2025/06/04/resolver"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 underline dark:text-indigo-400">
                Resolver pattern
              </a>, this app helps you map your consciousness by modeling different "selves" -
              the roles you embody in life. Each self has observations (what you know, what you could know)
              and an authority structure that legitimizes its experience.
              <br/><br/>
              The journey: relief → friction → breakthrough → relief.
              Simple to use, but not always easy to experience.
            </p>
            <div className="space-y-3">
              <button
                onClick={initializeTutorial}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <span className="block font-semibold">Interactive Tutorial</span>
                <span className="block text-xs opacity-90 mt-1">Learn step-by-step with a real example</span>
              </button>
              <button
                onClick={initializeDemo}
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <span className="block font-semibold">Begin with Demo</span>
                <span className="block text-xs opacity-90 mt-1">Explore with sample selves to understand the framework</span>
              </button>
              <button
                onClick={initializeEmpty}
                className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <span className="block font-semibold">Start Empty</span>
                <span className="block text-xs opacity-90 mt-1">Create your own selves from scratch</span>
              </button>
            </div>
          </div>
        </div>
        {showUserNameModal && <UserNameModal />}
        <PrivacyFooter />
      </>
    );
  }

  // Focused view - single self
  if (focusedSelf) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 pb-12">
          <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <User className="text-indigo-600 dark:text-indigo-400" size={24} />
              {editingSelf === focusedSelf.id ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    defaultValue={focusedSelf.name}
                    className="text-xl font-bold bg-white dark:bg-gray-700 dark:text-white border dark:border-gray-600 rounded px-2 py-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        updateSelfName(focusedSelf.id, e.target.value);
                      }
                    }}
                    autoFocus
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.parentNode.querySelector('input');
                      updateSelfName(focusedSelf.id, input.value);
                    }}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Save size={16} />
                  </button>
                  <button
                    onClick={() => setEditingSelf(null)}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold dark:text-white">{focusedSelf.name}</h2>
                  <button
                    onClick={() => setEditingSelf(focusedSelf.id)}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => deleteSelf(focusedSelf.id)}
                className="bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded hover:bg-red-600 dark:hover:bg-red-500 transition-colors text-sm flex items-center"
              >
                <Trash2 size={14} className="mr-1" />
                Delete
              </button>
              <button
                onClick={exitFocus}
                className={`bg-gray-500 dark:bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors text-sm ${getTutorialHighlight('exit-button')}`}
              >
                Exit Focus
              </button>
            </div>
          </div>

          {/* Authority Chain */}
          <div className={`mb-6 p-4 rounded-lg ${
            theme === 'colorblind'
              ? 'bg-white border-2 border-indigo-700'
              : 'bg-white/70 dark:bg-gray-800/70'
          } ${getTutorialHighlight('authority-section')}`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium mb-2 text-sm dark:text-gray-300 flex items-center">
                  Authority:
                  <Tooltip text="The source of validation for this self. What or who helps this self resolve conflicts and integrate new understanding. Can be internal (self-directed) or external." />
                </h3>
                {editingAuthority === focusedSelf.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      defaultValue={focusedSelf.authority.name}
                      className="w-full border rounded px-2 py-1 text-sm"
                      placeholder="Authority source"
                      ref={(input) => {
                        if (input) input.authorityName = input.value;
                      }}
                    />
                    <label className={`flex items-center text-sm ${getTutorialHighlight('authority-checkbox')}`}>
                      <input
                        type="checkbox"
                        defaultChecked={focusedSelf.authority.pointsToSelf}
                        className="mr-2"
                        ref={(checkbox) => {
                          if (checkbox) checkbox.pointsToSelf = checkbox.checked;
                        }}
                      />
                      Self-directed
                      <Tooltip text="Check if this self validates itself internally. Uncheck if it needs external approval or validation." />
                    </label>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          const container = e.target.parentNode.parentNode;
                          const input = container.querySelector('input[type="text"]');
                          const checkbox = container.querySelector('input[type="checkbox"]');
                          updateAuthority(focusedSelf.id, input.value, checkbox.checked);
                        }}
                        className="text-green-600 hover:text-green-800 flex items-center text-sm"
                      >
                        <Save size={14} className="mr-1" />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingAuthority(null)}
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 flex items-center text-sm"
                      >
                        <X size={14} className="mr-1" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {focusedSelf.authority.pointsToSelf 
                      ? `${focusedSelf.name} (self-directed)` 
                      : `Defers to: ${focusedSelf.authority.name}`}
                  </div>
                )}
              </div>
              {editingAuthority !== focusedSelf.id && (
                <button
                  onClick={() => setEditingAuthority(focusedSelf.id)}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 ml-2"
                >
                  <Edit2 size={14} />
                </button>
              )}
            </div>
          </div>

          {/* 2x2 Consciousness Frame */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <ObservationCard
              title="Knowable A"
              observations={focusedSelf.observations.knowable_1}
              category="knowable_1"
              highlightClass={getTutorialHighlight('knowable-1-section')}
            />
            <div className={`${theme === 'colorblind' ? 'bg-gray-100 border-2 border-dashed border-gray-600' : 'bg-gray-200 dark:bg-gray-700'} p-4 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm`}>
              <div className="text-center">
                <div className="font-medium flex items-center justify-center">
                  {theme === 'colorblind' && <span className="mr-2 text-lg font-bold">?</span>}
                  Unknown
                  <Tooltip text="The things you don't know you don't know. This stays empty - it represents what lies beyond current imagination." />
                </div>
                <div className="text-xs mt-1">Remains empty by definition</div>
              </div>
            </div>
            <ObservationCard
              title="Known"
              observations={focusedSelf.observations.known}
              category="known"
              highlightClass={getTutorialHighlight('known-section')}
            />
            <ObservationCard
              title="Knowable B"
              observations={focusedSelf.observations.knowable_2}
              category="knowable_2"
              highlightClass={getTutorialHighlight('knowable-2-section')}
            />
          </div>

          {/* Notes Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="font-medium mb-3 flex items-center justify-between dark:text-white">
              <div className="flex items-center">
                <StickyNote className="mr-2" size={16} />
                Notes for {focusedSelf.name}
              </div>
              {!editingNotes && (
                <button
                  onClick={() => setEditingNotes(true)}
                  className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
                >
                  <Edit2 size={14} />
                </button>
              )}
            </h3>
            {editingNotes ? (
              <div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-48 border rounded p-3 text-sm font-mono"
                  placeholder="Write your notes here... Supports markdown formatting!"
                />
                <div className="mt-2 flex justify-between">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Supports: **bold**, *italic*, # headers, - lists
                  </div>
                  <button
                    onClick={() => setEditingNotes(false)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 text-sm whitespace-pre-wrap font-mono text-gray-700 dark:text-gray-300"
                     style={{ minHeight: '8rem' }}
                     dangerouslySetInnerHTML={{
                       __html: notes
                         ? notes
                             .replace(/</g, '&lt;')
                             .replace(/>/g, '&gt;')
                             .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                             .replace(/\*(.*?)\*/g, '<em>$1</em>')
                             .replace(/^# (.*?)$/gm, '<h1 class="text-lg font-bold mt-2">$1</h1>')
                             .replace(/^## (.*?)$/gm, '<h2 class="text-md font-bold mt-2">$1</h2>')
                             .replace(/^- (.*?)$/gm, '• $1')
                             .replace(/\n/g, '<br/>')
                         : '<span class="text-gray-400">Click edit to add notes...</span>'
                     }}
                />
              </div>
            )}
          </div>
        </div>
        </div>
        {showObservationModal && <ObservationModal />}
        {showDeleteConfirm && <DeleteConfirmModal />}
        {tutorialMode && <TutorialOverlay />}
        <PrivacyFooter />
      </>
    );
  }

  // Board view - multiple selves
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4 pb-12">
        <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold dark:text-white">Your Resolver Board</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {selves.length}/3 self models
            </div>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-xs px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
            >
              Start Fresh
            </button>
            <ThemeSwitcher />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selves.map((self, index) => (
            <div
              key={self.id}
              className={`rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow relative ${
                theme === 'colorblind'
                  ? `bg-white border-2 ${
                      index === 0 ? 'border-slate-700' :
                      index === 1 ? 'border-blue-700' :
                      'border-amber-700'
                    }`
                  : 'bg-white dark:bg-gray-800'
              }`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSelf(self.id);
                }}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-60 hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
              
              <div 
                onClick={() => focusOnSelf(self)}
                className="cursor-pointer"
              >
                <div className="flex items-center mb-4 pr-8">
                  <User className="text-indigo-600 dark:text-indigo-400 mr-2" size={20} />
                  <h3 className="font-bold dark:text-white">{self.name}</h3>
                </div>
                
                <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                  <div>Known: {self.observations.known.length} items</div>
                  <div>Knowables: {self.observations.knowable_1.length + self.observations.knowable_2.length} items</div>
                  <div className="text-xs pt-2 border-t">
                    Authority: {self.authority.pointsToSelf ? "Self" : self.authority.name}
                  </div>
                </div>
                
                <div className="mt-4 text-xs text-indigo-600 dark:text-indigo-400">
                  Click to focus →
                </div>
              </div>
            </div>
          ))}

          {selves.length < 3 && (
            <div
              onClick={() => setShowCreateModal(true)}
              className={`rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow flex items-center justify-center ${
                theme === 'colorblind'
                  ? 'bg-white border-2 border-dashed border-gray-700 hover:border-indigo-700 hover:bg-gray-50'
                  : 'bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="text-center text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                <Plus size={24} className="mx-auto mb-2" />
                <div className="text-sm">Add New Self</div>
              </div>
            </div>
          )}
        </div>

        {/* Global Notes Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="font-medium mb-3 flex items-center justify-between dark:text-white">
            <div className="flex items-center">
              <StickyNote className="mr-2" size={16} />
              Resolver Notes
            </div>
            {!editingNotes && (
              <button
                onClick={() => setEditingNotes(true)}
                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm"
              >
                <Edit2 size={14} />
              </button>
            )}
          </h3>
          {editingNotes ? (
            <div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-40 border rounded p-3 text-sm font-mono dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
                placeholder="Write your notes here... Supports markdown formatting!"
              />
              <div className="mt-2 flex justify-between">
                <div className="text-xs text-gray-500">
                  Markdown: **bold**, *italic*, # headers, - lists
                </div>
                <button
                  onClick={() => setEditingNotes(false)}
                  className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 text-sm whitespace-pre-wrap font-mono text-gray-700 dark:text-gray-200"
                   style={{ minHeight: '6rem' }}
                   dangerouslySetInnerHTML={{
                     __html: notes
                       ? notes
                           .replace(/</g, '&lt;')
                           .replace(/>/g, '&gt;')
                           .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                           .replace(/\*(.*?)\*/g, '<em>$1</em>')
                           .replace(/^# (.*?)$/gm, '<h1 class="text-lg font-bold mt-2">$1</h1>')
                           .replace(/^## (.*?)$/gm, '<h2 class="text-md font-bold mt-2">$1</h2>')
                           .replace(/^- (.*?)$/gm, '• $1')
                           .replace(/\n/g, '<br/>')
                       : '<span class="text-gray-400">Click edit to add notes...</span>'
                   }}
              />
            </div>
          )}
        </div>

        {/* Create Self Modal */}
        {showCreateModal && <CreateSelfModal />}
        </div>
      </div>
      {showDeleteConfirm && <DeleteConfirmModal />}
      {showResetConfirm && <ResetConfirmModal />}
      {tutorialMode && <TutorialOverlay />}
      <PrivacyFooter />
    </>
  );
};

export default ResolverApp;
