var lock = new Auth0Lock('c4pFobE96YavypEEihgQRK7VDNrcT2dv', 'jordanwade.auth0.com', {
  auth: {
    params: {
      scope: 'openid email'
    }
  }
});
lock.on("authenticated", function(authResult) {
  localStorage.setItem('idToken', authResult.idToken);
  showDirectory();

});

$(document).ready(function () {
  $('#btn-login').click(function(e) {
  e.preventDefault();
  lock.show();
});
  if (localStorage.getItem('idToken')) {
    showDirectory();
  }

  $('#newStudent').on('submit', createStudent)
})

function createStudent(e) {
  e.preventDefault();
  $.ajax({
    url: '/students',
    method: 'POST',
    data: {
      firstName: $('#firstName').val(),
      lastName: $('#lastName').val()
    },
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
  })
  .done(function (data) {
    loadStudent(data);
    $('#firstName').val('').focus();
    $('#lastName').val('')
  })

}
function showDirectory() {
  $('#welcome').hide();
  $('#students-section').show();
  $.ajax({
    url: '/students',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('idToken')
    }
  })
  .done(function (data) {
    data.forEach(loadStudent)
  })
}

function loadStudent(student) {
  console.log('student', student);
  var li = $('<li />')
  li.text(student.firstName + ' ' + student.lastName + ' ')
  $('#student-list').append(li)
}
