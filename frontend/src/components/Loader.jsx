export default function Loader({ size = 'md' }) {
  const s = { sm: 'h-5 w-5', md: 'h-10 w-10', lg: 'h-16 w-16' }[size];
  return (
    <div className="flex justify-center items-center py-12">
      <div className={`${s} border-4 border-primary/20 border-t-primary rounded-full animate-spin`}></div>
    </div>
  );
}
