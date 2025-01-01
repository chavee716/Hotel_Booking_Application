export default function Image({src, ...rest}) {
  if (typeof src !== 'string') {
    console.error('Expected src to be a string but received:', src);
    src = ''; // Fallback to an empty string or handle it as needed
  }

  src = src.includes('https://')
    ? src
    : 'http://localhost:5000' + src;

  return (
    <img {...rest} src={src} alt={''} />
  );
}