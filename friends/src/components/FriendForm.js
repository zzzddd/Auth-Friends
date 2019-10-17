import React from "react";
import axiosWithAuth from "../utils/axiosWithAuth";

export default function FriendForm(props) {
  // Creating our state, and our handleChanges function
  const [form, setForm] = React.useState({ name: "", age: "", email: "" });
  const handleChanges = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // IF our editingFriend changes, we call useEffect:
  React.useEffect(() => {
    // If editingFriend is true -> We do have someone we want to edit,
    // so setForm() with all of our current values so we can update them.
    if (props.editingFriend) {
      setForm({
        name: props.editingFriend.name,
        age: props.editingFriend.age,
        email: props.editingFriend.email
      });

      // If editingFriend is not true -> We don't have anyone we want to edit,
      // so reset the form.
    } else {
      setForm({ name: "", age: "", email: "" });
    }
  }, [props.editingFriend]); // Listening for props.editingFriend

  /**
   * When we submit our Form successfully, two things could happen.
   * - If we're editing a friend, we call a `PUT` request
   * - If we're simply adding a friend, we call a `POST` request
   *
   * On a successful request, we always update our state, reset our form,
   * and set our EditingFriend to `null` so the code knows we're no longer editing.
   */
  const submitHandler = e => {
    e.preventDefault();

    // If editingFriend is true -> We are editing a friend, so we want a PUT request
    if (props.editingFriend) {
      axiosWithAuth()
        .put(`/api/friends/${props.editingFriend.id}`, form)
        .then(res => {
          console.log("EDIT", res);
          props.setFriends(res.data);
          setForm({ name: "", age: "", email: "" });
          props.setEditingFriend(null);
        });

      // If editingFriend is not true -> We aren't editing a friend, so we want a POST request
    } else {
      axiosWithAuth()
        .post("/api/friends", form)
        .then(res => {
          console.log("POST", res);
          props.setFriends(res.data);
          setForm({ name: "", age: "", email: "" });
        })
        .catch(err => console.log(err.response));
    }
  };

  // Set's editingFriend to null to tell the code that we are no longer editing
  const closeEdit = e => {
    e.preventDefault();
    props.setEditingFriend(null);
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <input
          required
          type="text"
          name="name"
          value={form.name}
          onChange={handleChanges}
        />
        <input
          required
          type="number"
          name="age"
          value={form.age}
          onChange={handleChanges}
        />
        <input
          required
          type="email"
          name="email"
          value={form.email}
          onChange={handleChanges}
        />
        <button type="submit">
          {props.editingFriend ? "Submit edit" : "Add Friend"}
        </button>
        <button onClick={closeEdit}>Cancel</button>
      </form>
    </div>
  );
}
