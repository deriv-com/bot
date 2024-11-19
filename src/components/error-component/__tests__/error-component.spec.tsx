import { render, screen } from '@testing-library/react';
import ErrorComponent from '../error-component';

describe('<ErrorComponent/>', () => {
    it('should render PageError component', () => {
        render(<ErrorComponent header='Error' message='Error message' />);
        expect(screen.getByText('Error message')).toBeInTheDocument();
    });
});
