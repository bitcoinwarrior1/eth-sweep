import { render, screen } from '@testing-library/react';
import Main from './components/main';

test('renders learn react link', () => {
  render(<Main />);
  const linkElement = screen.getByText("Ether");
  expect(linkElement).toBeInTheDocument();
});
