export const preventDialogClose = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault();
  }
};
