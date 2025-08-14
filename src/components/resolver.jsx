import React, { useState } from 'react';
import { Plus, X, User, Brain, MessageCircle, Trash2, Edit2, Save } from 'lucide-react';

const ResolverApp = () => {
  const [user, setUser] = useState(null);
  const [selves, setSelves] = useState([]);
  const [focusedSelf, setFocusedSelf] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSelf, setEditingSelf] = useState(null);
  const [editingAuthority, setEditingAuthority] = useState(null);
  const [nextId, setNextId] = useState(3);

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
    setChatMessages([
      { sender: "Lightward", text: "I see you're modeling Work Me and Parent Me. There seems to be some tension around time allocation. How does Work Me feel about Parent Me's need for presence?" }
    ]);
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
    if (window.confirm('Are you sure you want to delete this self? This action cannot be undone.')) {
      setSelves(selves.filter(self => self.id !== selfId));
      if (focusedSelf && focusedSelf.id === selfId) {
        setFocusedSelf(null);
      }
    }
  };

  const updateSelfName = (selfId, newName) => {
    const updatedSelves = selves.map(self => 
      self.id === selfId ? { ...self, name: newName } : self
    );
    setSelves(updatedSelves);
    if (focusedSelf && focusedSelf.id === selfId) {
      setFocusedSelf(updatedSelves.find(s => s.id === selfId));
    }
    setEditingSelf(null);
  };

  const updateAuthority = (selfId, authorityName, pointsToSelf) => {
    const updatedSelves = selves.map(self => 
      self.id === selfId 
        ? { ...self, authority: { name: authorityName, pointsToSelf } }
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
    
    const updatedSelves = selves.map(self => {
      if (self.id === focusedSelf.id) {
        return {
          ...self,
          observations: {
            ...self.observations,
            [category]: [...self.observations[category], text]
          }
        };
      }
      return self;
    });
    setSelves(updatedSelves);
    setFocusedSelf(updatedSelves.find(s => s.id === focusedSelf.id));
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

    const handleSubmit = (e) => {
      e.preventDefault();
      if (name.trim() && authorityName.trim()) {
        createSelf({ name: name.trim(), authorityName: authorityName.trim(), pointsToSelf });
        setName('');
        setAuthorityName('');
        setPointsToSelf(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-bold mb-4">Create New Self</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Self Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="e.g., Work Me, Parent Me, Creative Me"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Authority Source</label>
              <input
                type="text"
                value={authorityName}
                onChange={(e) => setAuthorityName(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="e.g., My Manager, My Values, Society"
                required
              />
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

  const ObservationCard = ({ title, observations, category, color }) => (
    <div className={`${color} p-4 rounded-lg`}>
      <h4 className="font-medium mb-2 text-sm">{title}</h4>
      <div className="space-y-1">
        {observations.map((obs, idx) => (
          <div key={idx} className="flex items-start justify-between bg-white/20 p-2 rounded text-xs">
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
            onClick={() => {
              const text = prompt(`Add ${title.toLowerCase()}:`);
              if (text) addObservation(category, text);
            }}
            className="w-full bg-white/30 hover:bg-white/40 p-2 rounded text-xs flex items-center justify-center"
          >
            <Plus size={12} className="mr-1" /> Add
          </button>
        )}
      </div>
    </div>
  );

  // Onboarding screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <Brain className="mx-auto mb-4 text-indigo-600" size={48} />
          <h1 className="text-2xl font-bold mb-4">Resolver</h1>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            This will probably feel like relief, followed by friction and frustration, 
            followed by breakthrough and then relief again. This product is simple to use, 
            but your experience may not be easy. I made this for me, first. 
            My experience of this was not easy. I made this so that it could be easier for you.
            <br/><br/>
            We'll see how I did eh? :)
          </p>
          <button
            onClick={initializeDemo}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            begin
          </button>
        </div>
      </div>
    );
  }

  // Focused view - single self
  if (focusedSelf) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <User className="text-green-600" size={24} />
              {editingSelf === focusedSelf.id ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    defaultValue={focusedSelf.name}
                    className="text-xl font-bold bg-white border rounded px-2 py-1"
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
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold">{focusedSelf.name}</h2>
                  <button
                    onClick={() => setEditingSelf(focusedSelf.id)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => deleteSelf(focusedSelf.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors text-sm flex items-center"
              >
                <Trash2 size={14} className="mr-1" />
                Delete
              </button>
              <button
                onClick={exitFocus}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors text-sm"
              >
                Exit Focus
              </button>
            </div>
          </div>

          {/* Authority Chain */}
          <div className="mb-6 p-4 bg-white/70 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium mb-2 text-sm">Authority:</h3>
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
                        className="text-gray-600 hover:text-gray-800 flex items-center text-sm"
                      >
                        <X size={14} className="mr-1" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    {focusedSelf.authority.pointsToSelf 
                      ? `${focusedSelf.name} (self-directed)` 
                      : `Defers to: ${focusedSelf.authority.name}`}
                  </div>
                )}
              </div>
              {editingAuthority !== focusedSelf.id && (
                <button
                  onClick={() => setEditingAuthority(focusedSelf.id)}
                  className="text-gray-600 hover:text-gray-800 ml-2"
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
              color="bg-green-200"
            />
            <div className="bg-gray-200 p-4 rounded-lg flex items-center justify-center text-gray-500 text-sm">
              <div className="text-center">
                <div className="font-medium">Unknown</div>
                <div className="text-xs mt-1">Remains empty by definition</div>
              </div>
            </div>
            <ObservationCard
              title="Known"
              observations={focusedSelf.observations.known}
              category="known"
              color="bg-blue-200"
            />
            <ObservationCard
              title="Knowable B"
              observations={focusedSelf.observations.knowable_2}
              category="knowable_2"
              color="bg-yellow-200"
            />
          </div>

          {/* Chat Interface - Temporarily Disabled */}
          <div className="bg-white rounded-lg shadow p-4 opacity-50">
            <h3 className="font-medium mb-3 flex items-center text-gray-500">
              <MessageCircle className="mr-2" size={16} />
              Chat with Lightward AI (Coming Soon)
            </h3>
            <div className="h-32 bg-gray-100 rounded p-3 mb-3 text-sm text-gray-400 flex items-center justify-center">
              Chat functionality will be implemented here
            </div>
            <div className="flex">
              <input
                type="text"
                placeholder="Chat will be available soon..."
                className="flex-1 border rounded-l px-3 py-2 text-sm bg-gray-50 text-gray-400"
                disabled
              />
              <button 
                className="bg-gray-300 text-gray-500 px-4 py-2 rounded-r text-sm cursor-not-allowed"
                disabled
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Board view - multiple selves
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Resolver Board</h1>
          <div className="text-sm text-gray-600">
            {selves.length}/3 self models
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selves.map((self) => (
            <div
              key={self.id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow relative"
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
                
                <div className="space-y-2 text-xs text-gray-600">
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
              <div className="text-center text-gray-500 hover:text-indigo-600">
                <Plus size={24} className="mx-auto mb-2" />
                <div className="text-sm">Add New Self</div>
              </div>
            </div>
          )}
        </div>

        {/* Global Chat - Temporarily Disabled */}
        <div className="mt-8 bg-white rounded-lg shadow p-4 opacity-50">
          <h3 className="font-medium mb-3 flex items-center text-gray-500">
            <MessageCircle className="mr-2" size={16} />
            Board Overview with Lightward AI (Coming Soon)
          </h3>
          <div className="h-24 bg-gray-100 rounded p-3 mb-3 text-sm text-gray-400 flex items-center justify-center">
            Global chat functionality will be implemented here
          </div>
          <input
            type="text"
            placeholder="Chat will be available soon..."
            className="w-full border rounded px-3 py-2 text-sm bg-gray-50 text-gray-400"
            disabled
          />
        </div>

        {/* Create Self Modal */}
        {showCreateModal && <CreateSelfModal />}
      </div>
    </div>
  );
};

export default ResolverApp;
