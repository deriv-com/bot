import classNames from 'classnames';

type TCounterProps = {
    className?: string;
    count: number;
};
const Counter = ({ className, count }: TCounterProps) => {
    return <div className={classNames('dc-counter', className)}>{count}</div>;
};

export default Counter;
