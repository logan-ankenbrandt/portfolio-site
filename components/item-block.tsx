import { BeforeAfter } from '@/components/before-after';
import { DownloadList, type DownloadLink } from '@/components/download-list';
import { LogView } from '@/components/log-view';
import { bytesOf, fileUrl, image, type Item, type SyncedProject } from '@/lib/content';
import { KIND_LABEL, KIND_NOTE, afterAlt, overlayAlt, sourceAlt } from '@/lib/format';

export function ItemBlock({ project, item }: { project: SyncedProject; item: Item }) {
  const { slug, repo } = project.portfolio;
  const before = item.source ? image(project, item.source.image, sourceAlt(item)) : null;
  const after = image(project, item.after.image, afterAlt(item));
  const overlay = item.overlay && item.source ? image(project, item.overlay, overlayAlt(item)) : null;

  const files: DownloadLink[] = [];
  if (item.after.pptx) files.push({ label: 'Slide as PowerPoint', href: fileUrl(slug, item.after.pptx), bytes: bytesOf(project, item.after.pptx) });
  if (item.after.pdf) files.push({ label: 'Slide as PDF', href: fileUrl(slug, item.after.pdf), bytes: bytesOf(project, item.after.pdf) });
  files.push({ label: 'Full log', href: fileUrl(slug, item.logMarkdown), bytes: bytesOf(project, item.logMarkdown) });

  return (
    <article id={item.id} aria-labelledby={`${item.id}-title`} className="scroll-mt-6">
      <p className="eyebrow text-accent">{KIND_LABEL[item.kind]}</p>
      <h3 id={`${item.id}-title`} className="mt-2 max-w-4xl text-[22px] leading-tight font-semibold tracking-tight sm:text-2xl">
        {item.title}
      </h3>
      <p className="mt-3 max-w-3xl text-muted">{item.summary}</p>

      <div className="mt-7">
        <BeforeAfter
          before={before}
          after={after}
          overlay={overlay}
          beforeNote="source image"
          afterNote={KIND_LABEL[item.kind].toLowerCase()}
          fullSizeProminent={item.kind === 'chart-faithful'}
        />
      </div>

      <div className="mt-10 grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="space-y-9">
          <section aria-labelledby={`${item.id}-about`}>
            <h4 id={`${item.id}-about`} className="eyebrow">
              About this version
            </h4>
            <p className="mt-2 text-[15px] leading-snug">{KIND_NOTE[item.kind]}</p>
          </section>

          {item.source ? (
            <section aria-labelledby={`${item.id}-source`}>
              <h4 id={`${item.id}-source`} className="eyebrow">
                Source
              </h4>
              <p className="mt-2 text-[15px] leading-snug font-semibold">{item.source.title}</p>
              <p className="mt-1 text-[15px] leading-snug text-muted">{item.source.page}</p>
              <p className="mt-2 text-[15px] leading-snug">{item.source.credit}</p>
              <p className="mt-2 text-[15px] leading-snug text-muted">{item.source.license}</p>
              <p className="mt-2 text-[15px]">
                <a href={item.source.url} className="link break-words">
                  Open the source
                </a>
              </p>
            </section>
          ) : (
            <section aria-labelledby={`${item.id}-source`}>
              <h4 id={`${item.id}-source`} className="eyebrow">
                Source
              </h4>
              <p className="mt-2 text-[15px] leading-snug text-muted">
                No single source image. This page draws on the sources credited at the bottom.
              </p>
            </section>
          )}

          <section aria-labelledby={`${item.id}-files`}>
            <h4 id={`${item.id}-files`} className="eyebrow">
              Files
            </h4>
            <div className="mt-3 text-[15px]">
              <DownloadList links={files} />
            </div>
            <p className="mt-3 text-[15px]">
              <a href={repo} className="link">
                Repo on GitHub<span className="sr-only">: {slug}</span>
              </a>
            </p>
          </section>
        </div>

        <section id={`${item.id}-log`} aria-labelledby={`${item.id}-log-title`} className="scroll-mt-6">
          <h4 id={`${item.id}-log-title`} className="text-lg font-semibold">
            Log
          </h4>
          <div className="mt-5">
            <LogView log={item.log} />
          </div>
        </section>
      </div>
    </article>
  );
}
