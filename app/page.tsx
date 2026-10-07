import { getOwner, getProjects, getSections } from "@/lib/data";
import { isOwner } from "@/lib/session";
import ChatPanel from "@/components/ChatPanel";
import ProjectCard from "@/components/ProjectCard";
import AddProjectForm from "@/components/AddProjectForm";
import SectionView from "@/components/SectionView";
import AuthControls from "@/components/AuthControls";

export const dynamic = "force-dynamic";

export default async function Home() {
  const owner = await isOwner();
  const profile = getOwner();
  const sections = getSections();
  const all = getProjects();
  const featured = all.filter((p) => p.shelf === "featured");
  const more = all.filter((p) => p.shelf === "more");
  const toCard = (p: (typeof all)[number]) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    tags: JSON.parse(p.tags) as string[],
    link: p.link,
    shelf: p.shelf,
  });
  const featuredIds = featured.map((p) => p.id);
  const moreIds = more.map((p) => p.id);

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <div className="flex items-center justify-between">
        {owner && <span className="rounded bg-signal/20 px-2 py-0.5 text-xs text-signal">Edit mode</span>}
        {owner && <a href="/inbox" className="text-sm text-tealtext">Inbox</a>}
        <AuthControls owner={owner} />
      </div>
      {profile && (
        <header>
          <h1 className="text-4xl font-bold">{profile.name}</h1>
          <p className="mt-1 text-signal">{profile.role}</p>
          <p className="mt-4 text-muted">{profile.bio}</p>
        </header>
      )}

      {sections.map((s) => (
        <SectionView key={s.id} id={s.id} heading={s.heading} body={s.body} editable={owner} />
      ))}

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Featured</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {featured.map((p) => (
            <ProjectCard key={p.id} project={toCard(p)} editable={owner} shelfIds={featuredIds} otherShelfIds={moreIds} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">More work</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {more.map((p) => (
            <ProjectCard key={p.id} project={toCard(p)} editable={owner} shelfIds={moreIds} otherShelfIds={featuredIds} />
          ))}
        </div>
        {owner && <AddProjectForm />}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Chat</h2>
        <p className="mt-1 text-sm text-muted">Ask about Maya&apos;s work or draft a contact message.</p>
        <ChatPanel />
      </section>
    </main>
  );
}
