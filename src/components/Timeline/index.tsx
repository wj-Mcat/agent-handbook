import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export type TimelineLink = {
  label: string;
  href: string;
};

export type TimelineItemData = {
  date: string;
  title: string;
  description: string;
  /** 技术报告、开源仓库或官方发布页 */
  links?: TimelineLink[];
};

export type TimelineSectionData = {
  id: string;
  title: string;
  intro?: string;
  items: TimelineItemData[];
};

export type TimelineProps = {
  sections: TimelineSectionData[];
  className?: string;
};

/** 将 `**粗体**` 转为 <strong>，便于在数据里保留 Markdown 强调 */
function renderInlineEmphasis(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function TimelineDivider({section}: {section: TimelineSectionData}): JSX.Element {
  return (
    <li className={styles.divider} id={section.id} aria-labelledby={`${section.id}-title`}>
      <div className={styles.dateCol}>
        <span className={styles.dividerMarker} aria-hidden />
      </div>
      <div className={styles.dividerBody}>
        <h2 className={styles.dividerTitle} id={`${section.id}-title`}>
          <span className={styles.dividerTitleText}>{section.title}</span>
        </h2>
        {section.intro ? <p className={styles.dividerIntro}>{section.intro}</p> : null}
      </div>
    </li>
  );
}

function TimelineItem({item}: {item: TimelineItemData}): JSX.Element {
  return (
    <li className={styles.item}>
      <div className={styles.dateCol}>
        <span className={styles.marker} aria-hidden />
        <time className={styles.date} dateTime={item.date}>
          {item.date}
        </time>
      </div>
      <article className={styles.content}>
        <h3 className={styles.eventTitle}>{renderInlineEmphasis(item.title)}</h3>
        <p className={styles.significance}>{item.description}</p>
        {item.links && item.links.length > 0 ? (
          <p className={styles.linkRow}>
            {item.links.map((link, index) => (
              <React.Fragment key={link.href}>
                {index > 0 ? <span className={styles.linkSep}>·</span> : null}
                <a
                  className={styles.link}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer">
                  {link.label}
                </a>
              </React.Fragment>
            ))}
          </p>
        ) : null}
      </article>
    </li>
  );
}

export default function Timeline({sections, className}: TimelineProps): JSX.Element {
  return (
    <div className={clsx(styles.timeline, className)}>
      <ol className={styles.list}>
        {sections.map((section) => (
          <React.Fragment key={section.id}>
            <TimelineDivider section={section} />
            {section.items.map((item) => (
              <TimelineItem
                key={`${section.id}-${item.date}-${item.title}`}
                item={item}
              />
            ))}
          </React.Fragment>
        ))}
      </ol>
    </div>
  );
}
