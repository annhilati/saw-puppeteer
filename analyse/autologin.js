const username = 'deinBenutzername'; // Dein Benutzername
const password = 'deinPasswort'; // Dein Passwort

// Die Eingabefelder direkt über ihre ID finden
document.getElementById('username').value = username;
document.getElementById('password').value = password;

// Auf den Submit-Button klicken
const submitButton = document.querySelector('button[type="submit"]');
if (submitButton) {
    submitButton.click();
} else {
    console.error('Submit-Button nicht gefunden!');
}
