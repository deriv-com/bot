import { Loader } from '@deriv-com/ui';

export default function ChunkLoader({ message }: { message: string }) {
    return (
        <div className='app-root'>
            <Loader />
            <div className='load-message'>{message}</div>
        </div>
    );
}
