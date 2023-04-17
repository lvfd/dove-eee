export function setMainMinHeight() {
  const header = document.querySelector('header')
  const main = document.querySelector('main')
  const footer = document.querySelector('footer')
  if (!header || !main || !footer) return console.error('no header or main or footer')
  let h1 = window.getComputedStyle(header).getPropertyValue('height')
  console.log(h1)
  h1 = parseInt(h1)? h1: '80px'
  const h2 = window.getComputedStyle(footer).getPropertyValue('height')
  const minHeight = parseInt(window.innerHeight) - parseInt(h1) - parseInt(h2)
  main.style.minHeight = minHeight + 'px'
}

window.addEventListener('load', setMainMinHeight)
window.addEventListener('resize', setMainMinHeight)