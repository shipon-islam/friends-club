export default function Layout({ className = "bg-none", children }) {
  return (
    <section
      className={`${className} text-gray-900 px-4 md:px-14`}
    >
      {children}
    </section>
  );
}
