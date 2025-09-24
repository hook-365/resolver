import React, { useState, useEffect } from 'react';
import { Plus, X, User, Brain, Trash2, Edit2, Save, AlertCircle, StickyNote, Palette, Sun, Moon, Eye } from 'lucide-react';
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
      const authorityValidation = validateAuthorityName(authorityName);

      if (!nameValidation.isValid || !authorityValidation.isValid) {
        setErrors({
          name: nameValidation.error || '',
          authority: authorityValidation.error || ''
        });
        return;
      }

      createSelf({
        name: sanitizeInput(nameValidation.value),
        authorityName: sanitizeInput(authorityValidation.value),
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
              <label htmlFor="selfName" className="block text-sm font-medium mb-1">Self Name</label>
              <input
                id="selfName"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors({ ...errors, name: '' });
                }}
                className={`w-full border rounded px-3 py-2 ${errors.name ? 'border-red-500' : ''}`}
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
              <label htmlFor="authoritySource" className="block text-sm font-medium mb-1">Authority Source</label>
              <input
                id="authoritySource"
                type="text"
                value={authorityName}
                onChange={(e) => {
                  setAuthorityName(e.target.value);
                  setErrors({ ...errors, authority: '' });
                }}
                className={`w-full border rounded px-3 py-2 ${errors.authority ? 'border-red-500' : ''}`}
                placeholder="e.g., My Manager, My Values, Society"
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
              <label htmlFor="pointsToSelf" className="text-sm">
                This self is self-directed (authority points to self)
              </label>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
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
              className="px-4 py-2 border rounded hover:bg-gray-50"
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
              className="px-4 py-2 border rounded hover:bg-gray-50"
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

  // Theme Switcher Component
  const ThemeSwitcher = () => {
    const themes = [
      { id: 'light', name: 'Light', icon: Sun, colors: 'Default light theme' },
      { id: 'dark', name: 'Dark', icon: Moon, colors: 'Dark mode for low light' },
      { id: 'colorblind', name: 'Colorblind', icon: Eye, colors: 'High contrast, colorblind-friendly' }
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

  const ObservationCard = ({ title, observations, category, color }) => {
    // Theme-aware color mapping
    const colorMap = {
      light: {
        'knowable_1': 'bg-green-200',
        'knowable_2': 'bg-yellow-200',
        'known': 'bg-blue-200'
      },
      dark: {
        'knowable_1': 'bg-green-900',
        'knowable_2': 'bg-yellow-900',
        'known': 'bg-blue-900'
      },
      colorblind: {
        'knowable_1': 'bg-blue-200 border-2 border-blue-600',
        'knowable_2': 'bg-orange-200 border-2 border-orange-600',
        'known': 'bg-purple-200 border-2 border-purple-600'
      }
    };

    const themeColor = colorMap[theme]?.[category] || color;

    return (
    <div className={`${themeColor} p-4 rounded-lg`}>
      <h4 className="font-medium mb-2 text-sm">{title}</h4>
      <div className="space-y-1">
        {observations.map((obs, idx) => (
          <div key={idx} className="flex items-start justify-between bg-white/20 dark:bg-gray-700/50 p-2 rounded text-xs dark:text-gray-300">
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md text-center">
            <Brain className="mx-auto mb-4 text-indigo-600" size={48} />
            <h1 className="text-2xl font-bold mb-4 dark:text-white">Resolver</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
              This will probably feel like relief, followed by friction and frustration,
              followed by breakthrough and then relief again. This product is simple to use,
              but your experience may not be easy. I made this for me, first.
              My experience of this was not easy. I made this so that it could be easier for you.
              <br/><br/>
              We'll see how I did eh? :)
            </p>
            <div className="space-y-3">
              <button
                onClick={initializeDemo}
                className="w-full bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                begin with demo
              </button>
              <button
                onClick={initializeEmpty}
                className="w-full bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                start empty
              </button>
            </div>
          </div>
        </div>
        {showUserNameModal && <UserNameModal />}
      </>
    );
  }

  // Focused view - single self
  if (focusedSelf) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
          <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <User className="text-green-600" size={24} />
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
                  <h2 className="text-xl font-bold">{focusedSelf.name}</h2>
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
                className="bg-gray-500 dark:bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors text-sm"
              >
                Exit Focus
              </button>
            </div>
          </div>

          {/* Authority Chain */}
          <div className="mb-6 p-4 bg-white/70 dark:bg-gray-800/70 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium mb-2 text-sm dark:text-gray-300">Authority:</h3>
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
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        defaultChecked={focusedSelf.authority.pointsToSelf}
                        className="mr-2"
                        ref={(checkbox) => {
                          if (checkbox) checkbox.pointsToSelf = checkbox.checked;
                        }}
                      />
                      Self-directed
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
            />
            <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
              <div className="text-center">
                <div className="font-medium">Unknown</div>
                <div className="text-xs mt-1">Remains empty by definition</div>
              </div>
            </div>
            <ObservationCard
              title="Known"
              observations={focusedSelf.observations.known}
              category="known"
            />
            <ObservationCard
              title="Knowable B"
              observations={focusedSelf.observations.knowable_2}
              category="knowable_2"
            />
          </div>

          {/* Notes Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="font-medium mb-3 flex items-center justify-between">
              <div className="flex items-center">
                <StickyNote className="mr-2" size={16} />
                Notes for {focusedSelf.name}
              </div>
              {!editingNotes && (
                <button
                  onClick={() => setEditingNotes(true)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm"
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
      </>
    );
  }

  // Board view - multiple selves
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold dark:text-white">Your Resolver Board</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {selves.length}/3 self models
            </div>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-xs text-red-600 hover:text-red-800 underline dark:text-red-400 dark:hover:text-red-300"
            >
              Start Fresh
            </button>
            <ThemeSwitcher />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selves.map((self) => (
            <div
              key={self.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow relative"
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
                  <User className="text-indigo-600 mr-2" size={20} />
                  <h3 className="font-bold">{self.name}</h3>
                </div>
                
                <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                  <div>Known: {self.observations.known.length} items</div>
                  <div>Knowables: {self.observations.knowable_1.length + self.observations.knowable_2.length} items</div>
                  <div className="text-xs pt-2 border-t">
                    Authority: {self.authority.pointsToSelf ? "Self" : self.authority.name}
                  </div>
                </div>
                
                <div className="mt-4 text-xs text-indigo-600">
                  Click to focus →
                </div>
              </div>
            </div>
          ))}

          {selves.length < 3 && (
            <div 
              onClick={() => setShowCreateModal(true)}
              className="bg-gray-100 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-indigo-300 hover:bg-indigo-50"
            >
              <div className="text-center text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                <Plus size={24} className="mx-auto mb-2" />
                <div className="text-sm">Add New Self</div>
              </div>
            </div>
          )}
        </div>

        {/* Global Notes Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-4">
          <h3 className="font-medium mb-3 flex items-center justify-between">
            <div className="flex items-center">
              <StickyNote className="mr-2" size={16} />
              Resolver Notes
            </div>
            {!editingNotes && (
              <button
                onClick={() => setEditingNotes(true)}
                className="text-indigo-600 hover:text-indigo-800 text-sm"
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
                className="w-full h-40 border rounded p-3 text-sm font-mono"
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
              <div className="bg-gray-50 rounded p-3 text-sm whitespace-pre-wrap font-mono text-gray-700"
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
    </>
  );
};

export default ResolverApp;
