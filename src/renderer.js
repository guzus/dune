window.$ = window.jQuery = require('../scripts/jquery.min.js');

$('body').css({
  'width': '100%',
  'overflow': 'hidden'
})
$('button').css({
  'background-color': 'yellow',
  'font-size': '120%',
  'margin': '4px 2px',
  'border-radius': '8px',
});

$('a').css({
  'font-size': '120%',
  'color': 'black',
  'margin': '4px 2px',
  'border-radius': '8px',
});

$('.statistics').css({
  'display': 'flex',
  'vertical-align': 'middle',
});

$('.statistics > h2').css({
  'border': 'solid',
  'padding': '2px',
  'margin': '2px',
  'font-family': 'Monaco',
});
