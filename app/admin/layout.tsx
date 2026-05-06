import { SignOutButton } from '@/components/admin/SignOutButton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink flex flex-col">
      <header className="h-16 border-b border-gold-700/40 flex items-center justify-between px-6 md:px-10">
        <span className="font-display italic text-cream text-xl">
          TastexxSee <span className="text-gold-400 text-sm not-italic font-sans ml-2">Admin</span>
        </span>
        <SignOutButton />
      </header>
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
