interface AuthErrorProps {
    message: string;
}

export default function AuthError({ message }: AuthErrorProps) {
    return (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">{message}</p>
        </div>
    );
}