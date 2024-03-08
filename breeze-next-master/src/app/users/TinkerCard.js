// const frame = document.body.querySelector('.frame');

// let current = frame.querySelector('.card:last-child');
// let likeText = current.children[0];
// let startX = 0, startY = 0, moveX = 0, moveY = 0;

// initCard(current);

// document.querySelector('#like').onclick = () => {
//   moveX = 1;
//   moveY = 0;
//   complete();
// };
// document.querySelector('#hate').onclick = () => {
//   moveX = -1;
//   moveY = 0;
//   complete();
// };

// function initCard(card) {
//   card.addEventListener('pointerdown', onPointerDown);
// }

// function setTransform(x, y, deg, duration) {
//   current.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${deg}deg)`;
//   likeText.style.opacity = Math.abs((x / innerWidth * 2.1));
//   likeText.className = `is-like ${x > 0 ? 'like' : 'nope'}`;
//   if (duration) current.style.transition = `transform ${duration}ms`;
// }

// function onPointerDown({ clientX, clientY }) {
//   startX = clientX;
//   startY = clientY;
//   current.addEventListener('pointermove', onPointerMove);
//   current.addEventListener('pointerup', onPointerUp);
//   current.addEventListener('pointerleave', onPointerUp);
// }

// function onPointerMove({ clientX, clientY }) {
//   moveX = clientX - startX;
//   moveY = clientY - startY;
//   setTransform(moveX, moveY, moveX / innerWidth * 50);
// }

// function onPointerUp() {
//   current.removeEventListener('pointermove', onPointerMove);
//   current.removeEventListener('pointerup', onPointerUp);
//   current.removeEventListener('pointerleave', onPointerUp);
//   if (Math.abs(moveX) > frame.clientWidth / 2) {
//     current.removeEventListener('pointerdown', onPointerDown);
//     complete();
//   } else {
//     cancel();
//   }
// }

// function complete() {
//   const flyX = (Math.abs(moveX) / moveX) * innerWidth * 1.3;
//   const flyY = (moveY / moveX) * flyX;
//   setTransform(flyX, flyY, flyX / innerWidth * 50, innerWidth);

//   const prev = current;
//   const next = current.previousElementSibling;
//   if (next) initCard(next);
//   current = next;
//   likeText = current.children[0];
//   setTimeout(() => frame.removeChild(prev), innerWidth);
// }

// function cancel() {
//   setTransform(0, 0, 0, 100);
//   setTimeout(() => current.style.transition = '', 100);
// }
