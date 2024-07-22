import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import { TooltipMenuIcon } from '..';

describe('TooltipMenuIcon Component', () => {
    // it('renders correctly with default props', () => {
    //     render(
    //         <TooltipMenuIcon as='button' tooltipContent='Tooltip text'>
    //             Hover me
    //         </TooltipMenuIcon>
    //     );
    //     expect(screen.getByRole('button')).toHaveTextContent('Hover me');
    // });

    // it('displays tooltip on hover', async () => {
    //     render(
    //         <TooltipMenuIcon as='button' tooltipContent='Tooltip text'>
    //             Hover me
    //         </TooltipMenuIcon>
    //     );
    //     await userEvent.hover(screen.getByRole('button'));
    //     expect(screen.getByText('Tooltip text')).toBeInTheDocument();
    // });

    // it('accepts and applies custom tooltip position', async () => {
    //     render(
    //         <TooltipMenuIcon as='button' tooltipContent='Tooltip text' tooltipPosition='bottom'>
    //             Hover me
    //         </TooltipMenuIcon>
    //     );
    //     await userEvent.hover(screen.getByRole('button'));
    //     expect(screen.getByText('Tooltip text')).toBeInTheDocument();
    // });

    it("renders correctly with as='a'", () => {
        render(
            <TooltipMenuIcon as='a' href='https://test.com' tooltipContent='Tooltip text'>
                Hover me
            </TooltipMenuIcon>
        );
        expect(screen.getByRole('link')).toHaveTextContent('Hover me');
    });
});
