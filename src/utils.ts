export const colorForTopic = (tag: string | undefined): string => {
  switch (tag) {
    case 'html':
      return 'success';
    case 'css':
      return 'primary';
    case 'js':
      return 'warning';
    case 'react':
      return 'info';
    default:
      return 'secondary';
  }
};
