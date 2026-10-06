export function SkillChips({ skills, label = 'Skills shown' }: { skills: readonly string[]; label?: string }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-1.5">
      {skills.map((skill) => (
        <li key={skill} className="rounded-full border border-rule-strong px-2.5 py-0.5 text-[13px] leading-5 text-ink/85">
          {skill}
        </li>
      ))}
    </ul>
  );
}
