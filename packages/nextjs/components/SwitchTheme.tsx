export const SwitchTheme = ({ className }: { className?: string }) => {
  return (
    <div className={`${className} p-2`}>
      <button className="btn btn-ghost btn-sm">
        🌙
      </button>
    </div>
  );
};
