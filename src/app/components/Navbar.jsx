import React, { useContext, useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { PiButterflyDuotone } from "react-icons/pi";
import { v4 as uuidv4 } from "uuid"; // To generate unique group ids
import { redirect } from 'next/navigation'


const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [groupMembers, setGroupMembers] = useState([
    { uid: currentUser?.uid, displayName: currentUser?.displayName },
  ]);

  const handleuserSignout = (auth) => {
    signOut(auth);
redirect('/login');
  }
  const handleAddGroup = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowAddMembers(false);
    setGroupMembers([
      { uid: currentUser.uid, displayName: currentUser.displayName },
    ]);
    setGroupName("");
    setSearchTerm("");
    setSearchResults([]);
  };

  // Search for users in Firebase based on search term
  const handleSearch = async () => {
    const q = query(
      collection(db, "users"), // Assuming your registered users are stored in 'users' collection
      where("displayName", ">=", searchTerm), // You can modify this to better suit your needs
      where("displayName", "<=", searchTerm + "\uf8ff")
    );

    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      if (doc.id !== currentUser.uid) {
        // Ensure the user cannot add themselves
        users.push({ uid: doc.id, ...doc.data() });
      }
    });
    setSearchResults(users);
  };

  // Add user to group members
  const handleAddMember = (user) => {
    if (!groupMembers.some((member) => member.uid === user.uid)) {
      const updatedGroupMembers = [...groupMembers, user];
      setGroupMembers(updatedGroupMembers);

      // Store group members in localStorage
      localStorage.setItem(
        "groupMembers",
        JSON.stringify(updatedGroupMembers.map((member) => member.uid))
      );
    }
  };

  // Create group and save to database
  const handleCreateGroup = async () => {
    if (groupName.trim() === "") {
      alert("Group name cannot be empty.");
      return;
    }
    if (groupMembers.length < 3) {
      alert("Group members must be more than or equal to 3");
      return;
    }

    const groupId = uuidv4(); // Generate unique group id

    // Save group members in localStorage for this group
    localStorage.setItem(
      `group_${groupId}_members`,
      JSON.stringify(groupMembers.map((member) => member.uid))
    );

    // Create group in Firestore
    try {
      await setDoc(doc(db, "chats", `${groupId}`), { messages: [] });
      // Create a document for each user in the group to reflect the group chat
      Promise.all(
        groupMembers.map((member) => {
          return new Promise(async (resolve, reject) => {
            try {
              await setDoc(
                doc(db, "userChats", member.uid),
                {
                  [`${groupId}`]: {
                    groupInfo: {
                      groupName,
                      groupId,
                      members: groupMembers.map((member) => member.uid),
                    },
                    lastMessage: {
                      text: "Group created",
                    },
                    date: serverTimestamp(),
                  },
                },
                { merge: true }
              );
              console.log("added to user's chat", member);
              resolve();
            } catch (err) {
              console.log("error while adding to user chat", err);
              resolve();
            }
          });
        })
      );

      // Optionally, show success message or reset the state
      alert("Group created successfully!");
      closeModal();
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    }
  }, [searchTerm]);

  return (
    <>
      <div className={`navbar ${isModalOpen ? "blur" : ""}`}>
        <span className="logo">
          ChatApp
          <PiButterflyDuotone className="logoIcon" />
        </span>
        <div className="user">
          <img src="data:image/png;base64,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" alt="" />
          <span>{currentUser?.displayName}</span>
          <button onClick={() => handleuserSignout(auth)}>Sign out</button>
          <button onClick={handleAddGroup} className="add-group-btn">
            Add Group
          </button>
        </div>
      </div>

      {/* Modal for adding group members */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create a New Group</h2>
            <input
              type="text"
              placeholder="Enter Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />

            <button
              onClick={() => setShowAddMembers(true)}
              className="add-members-btn"
            >
              Add Members
            </button>

            {showAddMembers && (
              <div className="add-members-section">
                <input
                  type="text"
                  placeholder="Search for users"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="user-list">
                  {searchResults.map((user) => (
                    <div
                      key={user.uid}
                      className="user-item"
                      onClick={() => handleAddMember(user)}
                    >
                   {user.displayName}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {groupMembers.length > 0 && (
              <div className="group-members-list">
                <h4>Group Members:</h4>
                {groupMembers.map((member) => (
                  <div key={member.uid}>{member.displayName}</div>
                ))}
              </div>
            )}

            <button onClick={handleCreateGroup} className="create-group-btn">
              Create Group
            </button>
            <button onClick={closeModal} className="close-btn" >
              Close
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .navbar {
          position: relative;
          z-index: 1;
        }

        .navbar.blur {
          filter: blur(8px); /* Blurs the background when modal is open */
        }
        
        .add-group-btn {
          margin-left: 10px;
          padding: 5px 10px;
          background-color: #4caf50;
          color: white;
          border: none;
          cursor: pointer;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6); /* Semi-transparent background */
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2;
        }

        .modal {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          min-width: 300px;
          text-align: center;
        }

        .modal h2 {
          margin-bottom: 15px;
        }

        .modal input {
          margin-bottom: 10px;
          padding: 8px;
          width: 100%;
          border-radius: 5px;
          border: 1px solid #ccc;
        }

        .modal button {
          padding: 8px 15px;
          color: #FFF;
         background-color: #90EE90;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-left:4px;
          
        }
      `}</style>
    </>
  );
};

export default Navbar;
