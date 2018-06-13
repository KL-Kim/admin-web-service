import ms from 'ms';

const calcauteElapsedTime = (time) => {
  const now = Date.now();
  const timestamp  = new Date(time);
  const diff = now - timestamp;

  return ms(diff) + ' ago';
}

export default calcauteElapsedTime;
