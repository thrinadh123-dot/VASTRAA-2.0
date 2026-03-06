import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX } from 'react-icons/fi';

interface ToastAction {
    label: string;
    path: string;
}

interface CustomToastProps {
    message: string;
    actions?: ToastAction[];
    closeToast?: () => void;
}

const CustomToast: React.FC<CustomToastProps> = ({
    message,
    actions = [],
    closeToast
}) => {
    const navigate = useNavigate();

    return (
        <div className="premium-toast animate-toastIn relative overflow-hidden">
            {/* Brand Accent Bar */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#B91C1C]" />

            {/* Manual Close Icon */}
            <button
                onClick={closeToast}
                className="absolute top-3 right-3.5 text-white/50 hover:text-white transition-opacity duration-200"
                aria-label="Close"
            >
                <FiX size={14} />
            </button>

            {/* Content Area */}
            <div className="flex flex-col gap-2.5 pl-2 pr-4">
                <p className="text-[14px] font-medium text-white leading-tight pr-4">
                    {message}
                </p>

                {actions.length > 0 && (
                    <div className="flex items-center gap-5 mt-0.5">
                        {actions.map((action, index) => {
                            const isCheckout = action.label.toLowerCase().includes('checkout');
                            return (
                                <button
                                    key={index}
                                    onClick={() => {
                                        navigate(action.path);
                                        closeToast?.();
                                    }}
                                    className="text-[13px] font-bold text-white hover:opacity-75 transition-opacity duration-200 flex items-center gap-1"
                                >
                                    {action.label}
                                    {isCheckout && <span className="text-[14px]">→</span>}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomToast;
