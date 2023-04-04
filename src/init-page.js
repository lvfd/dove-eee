export function setMainMinHeight() {
  const header = document.querySelector('header')
  const main = document.querySelector('main')
  const footer = document.querySelector('footer')
  if (!header || !main || !footer) return console.error('no header or main or footer')
  const h1 = window.getComputedStyle(header).getPropertyValue('height')
  const h2 = window.getComputedStyle(footer).getPropertyValue('height')
  const minHeight = parseInt(window.innerHeight) - parseInt(h1) - parseInt(h2)
  main.style.minHeight = minHeight + 'px'
}

window.addEventListener('DOMContentLoaded', setMainMinHeight)
window.addEventListener('resize', setMainMinHeight)