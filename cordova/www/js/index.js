/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

navigator.geolocation.getCurrentPosition(onSuccess, onError);

function onSuccess(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  console.log('Latitude: ' + latitude + ' Longitude: ' + longitude);
}

function onError(error) {
  console.log('Error code: ' + error.code + ' Error message: ' + error.message);
}


function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}

// Attendre que Cordova soit prêt
document.addEventListener("deviceready", function() {
  // Créer une notification pour 5 secondes plus tard
  var date = new Date();
  date.setSeconds(date.getSeconds() + 20);

  cordova.plugins.notification.local.schedule({
    title: "Connect4",
    text: "It's time to play Connect4! Challenge your friends and show them who's the best player!",
    at: date,
    foreground: true,
    wakeup: true
  });
}, false);


//dans un cas réel , on utilise le code suivant,permettant d'afficher une notification chaque jour à 21:00
// Récupérer la date et l'heure actuelle
// var now = new Date();

// // Définir l'heure d'exécution de la notification sur 21h00
// var notificationTime = new Date();
// notificationTime.setHours(21);
// notificationTime.setMinutes(0);
// notificationTime.setSeconds(0);

// // Vérifier si l'heure actuelle est supérieure ou égale à l'heure d'exécution de la notification
// if (now >= notificationTime) {
//   // Si oui, ajouter un jour à la date d'exécution de la notification pour qu'elle soit exécutée demain à 21h00
//   notificationTime.setDate(notificationTime.getDate() + 1);
// }

// // Calculer le délai en millisecondes jusqu'à l'heure d'exécution de la notification
// var delay = notificationTime.getTime() - now.getTime();

// // Définir la fonction de rappel pour exécuter la notification
// var notificationCallback = function() {
//   // Code pour afficher la notification ici
//   var options = {
//     body: "Challenge your friends and show them who's the best player!",
//   };
//   var notification = new Notification("It's time to play Connect4!", options);
// }

// // Planifier l'exécution de la notification en utilisant setTimeout()
// setTimeout(notificationCallback, delay);

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    navigator.splashscreen.show();
    setTimeout(function() {
        navigator.splashscreen.hide();
    }, 10000);
}
