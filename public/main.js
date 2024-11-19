// var editBtns = document.getElementsByClassName("edit-Btn")
// var updateBtns = document.getElementsByClassName("update-Btn")
// var trash = document.getElementsByClassName("fa-trash-o");
// var completedBtns = document.getElementsByClassName("buttonForCompleted")

// Array.from(completedBtns).forEach(function(button) {
//   button.addEventListener('click', function(){
   
//     const parent = this.closest("li")
//     // console.log(btn)
//     parent.classList.toggle("listColor")
//   });
// });


// Array.from(editBtns).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const habitParent = this.closest("li")//grabbing the closest parent element when the button is clicked
//         const form = habitParent.querySelector(".formForUpdate")//list item is here. grab something that has the class of formUpdate. selecting something from a spwcif element
//         form.classList.toggle("hidden")//toggling the hidden class on the form that has been selected. takes away the hidden class if it has it, if it doesnt i goive is the class of hidden. so it hides it if it doenst have it, or it shows it if it;s hidden
//       });
// });

// Array.from(updateBtns).forEach(function(element) {
//   element.addEventListener('click', function(){
//     const habitParent = this.closest("li")
//     const currenthabit = habitParent.querySelector(".currentHabit").innerText
//     const currentbuddy = habitParent.querySelector(".newBuddy").innerText
//     const currentlength = habitParent.querySelector(".currentLength").innerText
//     const currentfrequency = habitParent.querySelector(".currentFrequency").innerText
//     const habitId = habitParent.dataset.id;

//     const newhabit = habitParent.querySelector(".newHabit").value
//     const newaccountabuddy = habitParent.querySelector(".newBuddy").value
//     const newlength = habitParent.querySelector(".newLength").value
//     const newfrequency = habitParent.querySelector(".newFrequency").value
//     console.log(habitId)
//     fetch('/updateHabit', {
//       method: 'put',
//       headers: {'Content-Type': 'application/json'},
//       body: JSON.stringify({
//         'currenthabit': currenthabit,
//         'currentbuddy': currentbuddy,
//         'currentlength': currentlength,
//         'currentfrequency': currentfrequency,
        
//         'habitId': habitId,
//         'newhabit': newhabit,
//         'newaccountabuddy': newaccountabuddy,
//         'newlength': newlength,
//         'newfrequency': newfrequency
//       })
//     })
//     .then(response => {
//       if (response.ok) return response.json()
//     })
//     .then(data => {
//       console.log(data)
//       window.location.reload(true)
//     })
//   });
// });

// Array.from(trash).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const habitItem = this.closest('.habittracker');
//         const habitId = habitItem.getAttribute('data-id');
//         fetch('deleteHabit', {
//           method: 'delete',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             'habitId': habitId
//           })
//         }).then(function (response) {
//           window.location.reload()
//         })
//       });
// });
var editFeedbackBtn = document.getElementsByClassName("edit-btn");
var deleteTaskBtn = document.getElementsByClassName("delete-btn");

Array.from(editFeedbackBtn).forEach(function(element) {
  element.addEventListener('click', function(){
    const taskId = this.dataset.id;
    const currentFeedback = this.dataset.feedback;
    
    const newFeedback = prompt('Enter new feedback', currentFeedback);

    fetch('/tasks/feedback', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: taskId,
        feedback: newFeedback.toLocaleLowerCase()
      })
    })
    .then(response => response.json())
    .then(data => window.location.reload());
  });
});
Array.from(deleteTaskBtn).forEach(function(element) {
  element.addEventListener('click', function(){
    const taskId = this.dataset.id;
    fetch('/tasks', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: taskId })
    }).then(response => window.location.reload());
  });
});