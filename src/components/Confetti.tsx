export const Confetti = () => {
  const colors = [
    "bg-primary",
    "bg-accent",
    "bg-success",
    "bg-secondary",
    "bg-destructive",
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className={`absolute w-2 h-2 ${
            colors[i % colors.length]
          } animate-confetti rounded-sm`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 20}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
};
