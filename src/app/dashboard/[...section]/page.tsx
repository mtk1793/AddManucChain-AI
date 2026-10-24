import { SectionContent } from './SectionContent'

export default async function DashboardSectionPage({
  params,
}: {
  params: Promise<{ section: string[] }>
}) {
  const resolved = await params
  return <SectionContent section={resolved.section} />
}
