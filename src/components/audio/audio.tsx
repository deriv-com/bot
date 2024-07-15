/* eslint-disable react/react-in-jsx-scope */
const Audio = () => (
    <>
        <audio
            id='announcement'
            aria-label='audio'
            src={`${window.__webpack_public_path__}assets/media/announcement.mp3`}
        />
        <audio id='earned-money' aria-label='audio' src={`${window.__webpack_public_path__}assets/media/coins.mp3`} />
        <audio id='job-done' aria-label='audio' src={`${window.__webpack_public_path__}assets/media/job-done.mp3`} />
        <audio id='error' aria-label='audio' src={`${window.__webpack_public_path__}assets/media/out-of-bounds.mp3`} />
        <audio
            id='severe-error'
            aria-label='audio'
            src={`${window.__webpack_public_path__}assets/media/i-am-being-serious.mp3`}
        />
    </>
);

export default Audio;
