const SidebarSkeleton = () => {
  const skeletonContacts = Array(7).fill(null);

  return (
    <aside className="h-full flex flex-col bg-base-100 border-r border-base-300">
      <div className="p-4 space-y-3 border-b border-base-300">
        <h2 className="text-lg font-semibold">Messages</h2>
        <div className="skeleton h-10 w-full rounded-xl" />
        <div className="skeleton h-9 w-full rounded-xl" />
      </div>

      <div className="flex-1 overflow-hidden p-2 space-y-1">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="p-2.5 flex items-center gap-3">
            <div className="skeleton size-11 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3.5 w-28 rounded" />
              <div className="skeleton h-3 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
