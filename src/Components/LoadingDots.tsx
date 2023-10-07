
const Loader = () => {
    const circleCommonClasses = 'h-8 w-8 bg-current   rounded-full';

    return (
        <div className='flex'>
            <div className={`${circleCommonClasses} mr-1 animate-bounce bg-primary-button-color `}></div>
            <div
                className={`${circleCommonClasses} mr-1 animate-bounce200 bg-primary-button-color`}
            ></div>
            <div className={`${circleCommonClasses} animate-bounce400 bg-primary-button-color`}></div>
        </div>
    );
};

export default Loader;