(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noise = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Audio = window.AudioContext || window.webkitAudioContext;
var context = new Audio();
var osc = undefined;
var rawAudio = [];
var prevText = '';
var processor = undefined;

function startOsc() {
  osc = context.createOscillator();
  processor = context.createScriptProcessor(256, 1, 1);
  osc.connect(processor);
  osc.connect(context.destination);
  processor.connect(context.destination);
  processor.onaudioprocess = handleAudio;
  osc.start();
}

function handleAudio(e) {
  var processData = e.inputBuffer.getChannelData(0);
  rawAudio = rawAudio.concat(Array.prototype.slice.call(processData, 0));
}

function plotWave() {
  var canvas = document.querySelector('canvas');
  var ctx = canvas.getContext('2d');
  var height = canvas.height;
  var width = canvas.width;

  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  rawAudio.forEach(function (v, i, arr) {
    ctx.lineTo(i / arr.length * width, (v + 1) / 2 * height);
  });
  ctx.stroke();
}

function updateOsc() {
  if (!osc) {
    startOsc();
  }

  osc.frequency.value = parseInt(document.querySelector('input[type="range"]').value, 10);
}

function stopOsc() {
  osc && osc.disconnect(context.destination);
  osc = null;
}

function encodeString(string, outputContainer) {
  outputContainer.innerHTML = require('string-to-binary')(string);
}

function pulseOsc(binary) {
  binary.split('').forEach(function (v, i) {
    // 0.022 roughly 45.45 baud
    osc.frequency.setValueAtTime(v == '1' ? 4000 : 1000, i * 0.022 + context.currentTime);
  });
  osc.frequency.setValueAtTime(0, (binary.length + 1) * 0.022 + context.currentTime);
  setTimeout(function () {
    requestAnimationFrame(plotWave);
  }, (binary.length + 3) * 0.022 + context.currentTime);
}

function onStringChangeToWave(string, outputContainer) {
  if (prevText === '') {
    stopOsc();
    startOsc();
  }

  var newText = string.slice(prevText.length);
  pulseOsc(require('string-to-binary')(newText));
  encodeString.apply(this, arguments);
  prevText = string;
}

module.exports = {
  stopOsc: stopOsc,
  onStringChange: encodeString,
  onStringChangeToWave: onStringChangeToWave,
  updateOsc: updateOsc
};

},{"string-to-binary":2}],2:[function(require,module,exports){
module.exports = function(str) {
  var pad = "00000000";

  return str.split('').map(function(str) {
    var binary = str.charCodeAt(0).toString(2);

    return pad.slice(binary.length)+binary;
  }).join('');
}

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL3NhbS9EZXNrdG9wL3JlcG9zL25vaXNlL2NvbXBvbmVudC1kZW1vcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zdHJpbmctdG8tYmluYXJ5L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFNLEtBQUssR0FBSSxNQUFNLENBQUMsWUFBWSxJQUFJLE1BQU0sQ0FBQyxrQkFBa0IsQUFBQyxDQUFDO0FBQ2pFLElBQU0sT0FBTyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7QUFDNUIsSUFBSSxHQUFHLFlBQUEsQ0FBQztBQUNSLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNsQixJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbEIsSUFBSSxTQUFTLFlBQUEsQ0FBQzs7QUFFZCxTQUFTLFFBQVEsR0FBRztBQUNsQixLQUFHLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixFQUFFLENBQUM7QUFDakMsV0FBUyxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3JELEtBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdkIsS0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDakMsV0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDdkMsV0FBUyxDQUFDLGNBQWMsR0FBRyxXQUFXLENBQUM7QUFDdkMsS0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0NBQ2I7O0FBRUQsU0FBUyxXQUFXLENBQUMsQ0FBQyxFQUFFO0FBQ3RCLE1BQUksV0FBVyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUMs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QUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVDLFVBQVEsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQy9DLGNBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3BDLFVBQVEsR0FBRyxNQUFNLENBQUM7Q0FDbkI7O0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRztBQUNmLFNBQU8sRUFBRSxPQUFPO0FBQ2hCLGdCQUFjLEVBQUUsWUFBWTtBQUM1QixzQkFBb0IsRUFBRSxvQkFBb0I7QUFDMUMsV0FBUyxFQUFFLFNBQVM7Q0FDckIsQ0FBQzs7O0FDbEZGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IEF1ZGlvID0gKHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCk7XG5jb25zdCBjb250ZXh0ID0gbmV3IEF1ZGlvKCk7XG5sZXQgb3NjO1xubGV0IHJhd0F1ZGlvID0gW107XG5sZXQgcHJldlRleHQgPSAnJztcbmxldCBwcm9jZXNzb3I7XG5cbmZ1bmN0aW9uIHN0YXJ0T3NjKCkge1xuICBvc2MgPSBjb250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiAgcHJvY2Vzc29yID0gY29udGV4dC5jcmVhdGVTY3JpcHRQcm9jZXNzb3IoMjU2LCAxLCAxKTtcbiAgb3NjLmNvbm5lY3QocHJvY2Vzc29yKTtcbiAgb3NjLmNvbm5lY3QoY29udGV4dC5kZXN0aW5hdGlvbik7XG4gIHByb2Nlc3Nvci5jb25uZWN0KGNvbnRleHQuZGVzdGluYXRpb24pO1xuICBwcm9jZXNzb3Iub25hdWRpb3Byb2Nlc3MgPSBoYW5kbGVBdWRpbztcbiAgb3NjLnN0YXJ0KCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUF1ZGlvKGUpIHtcbiAgbGV0IHByb2Nlc3NEYXRhID0gZS5pbnB1dEJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKTtcbiAgcmF3QXVkaW8gPSByYXdBdWRpby5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwocHJvY2Vzc0RhdGEsIDApKTtcbn1cblxuZnVuY3Rpb24gcGxvdFdhdmUoKSB7XG4gIGxldCBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdjYW52YXMnKTtcbiAgbGV0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICBsZXQgaGVpZ2h0ID0gY2FudmFzLmhlaWdodDtcbiAgbGV0IHdpZHRoID0gY2FudmFzLndpZHRoO1xuXG4gIGN0eC5jbGVhclJlY3QoMCwwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgY3R4LmJlZ2luUGF0aCgpO1xuICBjdHguc3Ryb2tlU3R5bGUgPVwicmdiYSgwLDAsMCwwLjIpXCI7XG4gIHJhd0F1ZGlvLmZvckVhY2goZnVuY3Rpb24odiwgaSwgYXJyKSB7XG4gICAgY3R4LmxpbmVUbyhpLyhhcnIubGVuZ3RoKSAqIHdpZHRoLCAodisxKS8yICogaGVpZ2h0KTtcbiAgfSk7XG4gIGN0eC5zdHJva2UoKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlT3NjKCkge1xuICBpZiAoIW9zYykge1xuICAgIHN0YXJ0T3NjKCk7XG4gIH1cblxuICBvc2MuZnJlcXVlbmN5LnZhbHVlID0gcGFyc2VJbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cInJhbmdlXCJdJykudmFsdWUsIDEwKTtcbn1cblxuZnVuY3Rpb24gc3RvcE9zYygpIHtcbiAgb3NjICYmIG9zYy5kaXNjb25uZWN0KGNvbnRleHQuZGVzdGluYXRpb24pO1xuICBvc2MgPSBudWxsO1xufVxuXG5mdW5jdGlvbiBlbmNvZGVTdHJpbmcoc3RyaW5nLCBvdXRwdXRDb250YWluZXIpIHtcbiAgb3V0cHV0Q29udGFpbmVyLmlubmVySFRNTCA9IHJlcXVpcmUoJ3N0cmluZy10by1iaW5hcnknKShzdHJpbmcpO1xufVxuXG5mdW5jdGlvbiBwdWxzZU9zYyhiaW5hcnkpIHtcbiAgYmluYXJ5LnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uKHYsIGkpIHtcbiAgICAvLyAwLjAyMiByb3VnaGx5IDQ1LjQ1IGJhdWRcbiAgICBvc2MuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKHYgPT0gJzEnID8gNDAwMCA6IDEwMDAsIGkgKiAwLjAyMiArIGNvbnRleHQuY3VycmVudFRpbWUpO1xuICB9KTtcbiAgb3NjLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZSgwLCAoYmluYXJ5Lmxlbmd0aCsxKSAqIDAuMDIyICsgY29udGV4dC5jdXJyZW50VGltZSk7XG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHBsb3RXYXZlKTtcbiAgfSwgKGJpbmFyeS5sZW5ndGgrMykgKiAwLjAyMiArIGNvbnRleHQuY3VycmVudFRpbWUpO1xufVxuXG5mdW5jdGlvbiBvblN0cmluZ0NoYW5nZVRvV2F2ZShzdHJpbmcsIG91dHB1dENvbnRhaW5lcikge1xuICBpZiAocHJldlRleHQgPT09ICcnKSB7XG4gICAgc3RvcE9zYygpO1xuICAgIHN0YXJ0T3NjKCk7XG4gIH1cblxuICBsZXQgbmV3VGV4dCA9IHN0cmluZy5zbGljZShwcmV2VGV4dC5sZW5ndGgpO1xuICBwdWxzZU9zYyhyZXF1aXJlKCdzdHJpbmctdG8tYmluYXJ5JykobmV3VGV4dCkpO1xuICBlbmNvZGVTdHJpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgcHJldlRleHQgPSBzdHJpbmc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzdG9wT3NjOiBzdG9wT3NjLFxuICBvblN0cmluZ0NoYW5nZTogZW5jb2RlU3RyaW5nLFxuICBvblN0cmluZ0NoYW5nZVRvV2F2ZTogb25TdHJpbmdDaGFuZ2VUb1dhdmUsXG4gIHVwZGF0ZU9zYzogdXBkYXRlT3NjXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzdHIpIHtcbiAgdmFyIHBhZCA9IFwiMDAwMDAwMDBcIjtcblxuICByZXR1cm4gc3RyLnNwbGl0KCcnKS5tYXAoZnVuY3Rpb24oc3RyKSB7XG4gICAgdmFyIGJpbmFyeSA9IHN0ci5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDIpO1xuXG4gICAgcmV0dXJuIHBhZC5zbGljZShiaW5hcnkubGVuZ3RoKStiaW5hcnk7XG4gIH0pLmpvaW4oJycpO1xufVxuIl19
