import React from "react";
import axiosWithAuth from "../utils/axiosWithAuth";
import FriendForm from "./FriendForm";

export default function FriendList() {
  // One state variable to hold our array of friend objects
  const [friends, setFriends] = React.useState([]);

  // One state variable to hold onto the single Friend object that we want to edit
  const [editingFriend, setEditingFriend] = React.useState();

  const fetchFriends = () => {
    axiosWithAuth()
      .get("/api/friends")
      .then(res => {
        console.log(res);
        setFriends(res.data);
      })
      .catch(err => console.log(err.response));
  };

  React.useEffect(() => {
    fetchFriends();
  }, []);

  /**
   * This function uses an axios call to remove a friend from the server.
   * If the request is successful, the Friend list will be updated to remove the deleted friend.
   * @param id The id of the friend you want to delete
   */
  const deleteFriend = id => {
    axiosWithAuth()
      .delete(`/api/friends/${id}`)
      .then(res => {
        console.log(res);
        setFriends(res.data);
      })
      .catch(err => console.log(err.response));
  };

  // Click on an edit button, and that specific friend becomes the one that we're editing!
  const editFriend = friendObj => {
    setEditingFriend(friendObj);
  };

  return (
    <div>
      <FriendForm
        editingFriend={editingFriend}
        setFriends={setFriends}
        setEditingFriend={setEditingFriend}
      />
      {/* This probably should map through the array and create a <Component/>, 
            but we just created a div to save a little time. */}
      {friends.map(friendObj => {
        return (
          <div key={friendObj.id}>
            {" "}
            {/* Basic info displayed */}
            <p> Name: {friendObj.name}</p>
            <p> Age: {friendObj.age}</p>
            <p>Email: {friendObj.email}</p>
            {/* Buttons to either edit or delete */}
            <button onClick={() => editFriend(friendObj)}>EDIT</button>{" "}
            <button onClick={() => deleteFriend(friendObj.id)}>DELETE</button>{" "}
          </div>
        );
      })}

      <button onClick={fetchFriends}>Push me!</button>
    </div>
  );
}
