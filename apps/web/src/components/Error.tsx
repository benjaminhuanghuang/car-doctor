interface ErrorProps {
  title?: string;
  message: string;
}

const Error = ({ title = 'Error loading cars', message }: ErrorProps) => {
  return (
    <div className="flex items-center justify-center min-h-100">
      <div className="text-center">
        <p className="text-lg font-semibold text-destructive">{title}</p>
        <p className="text-sm text-muted-foreground mt-2">{message}</p>
      </div>
    </div>
  );
};

export default Error;
