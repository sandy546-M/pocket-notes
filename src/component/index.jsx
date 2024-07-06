import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, FormControl } from 'react-bootstrap';

function PocketNotes() {
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [noteText, setNoteText] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedGroups = JSON.parse(localStorage.getItem('groups')) || [];
    setGroups(savedGroups);
  }, []);

  useEffect(() => {
    localStorage.setItem('groups', JSON.stringify(groups));
  }, [groups]);

  const addGroup = () => {
    if (groupName.trim() === '') return;
    
    const newGroup = {
      id: new Date().getTime().toString(),
      name: groupName,
      color: '#ffffff', // Placeholder for color selection
      notes: []
    };
    
    setGroups(prevGroups => [...prevGroups, newGroup]);
    setGroupName('');
    setShowModal(false);
  };

  const addNote = () => {
    if (noteText.trim() === '' || !currentGroup) return;
    
    const updatedGroups = groups.map(group => {
      if (group.id === currentGroup) {
        const newNote = {
          id: new Date().getTime().toString(),
          text: noteText,
          createdAt: new Date().toLocaleString()
        };
        return { ...group, notes: [...group.notes, newNote] };
      }
      return group;
    });
    
    setGroups(updatedGroups);
    setNoteText('');
  };

  const handleGroupChange = (groupId) => {
    setCurrentGroup(groupId);
  };

  const getCurrentGroupNotes = () => {
    if (!currentGroup) return [];
    const group = groups.find(group => group.id === currentGroup);
    return group ? group.notes : [];
  };

  return (
    <div className="container">
      <h1>Note Taking App</h1>
      
      {/* Group List */}
      <div className="group-list">
        <h2>Groups</h2>
        <ul>
          {groups.map(group => (
            <li key={group.id} onClick={() => handleGroupChange(group.id)}>
              {group.name}
            </li>
          ))}
        </ul>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add Group
        </Button>
      </div>
      
      {/* Add Note Form */}
      {currentGroup && (
        <div className="add-note-form">
          <h2>Add Note</h2>
          <Form>
            <Form.Group controlId="noteForm">
              <FormControl
                as="textarea"
                rows={3}
                placeholder="Enter your note..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={addNote}
              disabled={noteText.trim() === ''}
            >
              Send
            </Button>
          </Form>
        </div>
      )}
      
      {/* Modal for Adding Group */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="groupForm">
              <Form.Label>Group Name</Form.Label>
              <FormControl
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={addGroup}>
            Add Group
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Display Notes */}
      {currentGroup && (
        <div className="note-list">
          <h2>Notes</h2>
          <ul>
            {getCurrentGroupNotes().map(note => (
              <li key={note.id}>
                <div>{note.text}</div>
                <div>{note.createdAt}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PocketNotes;