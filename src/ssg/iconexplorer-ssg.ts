import type {
  SsgRoute,
  SsgRouteHtmlTransformer,
  SsgRouteInput,
  SsgRouteRenderContext,
} from '@md-plugins/vite-ssg-plugin'
import { iconSets } from '../icon-sets'

const siteUrl = 'https://iconexplorer.app'
const siteName = 'Icon Explorer'
const siteImage = `${siteUrl}/iconexplorer.app.png`
const defaultDescription =
  'Search, compare, preview, and copy Quasar-ready SVG icon imports from @quasar/extras and quasar-extras-svg-icons.'

type RouteSeo = {
  title: string
  description: string
  canonical: string
  heading: string
  summary: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function insertBeforeHeadClose(html: string, content: string): string {
  return html.includes('</head>')
    ? html.replace('</head>', `${content}\n</head>`)
    : `${content}\n${html}`
}

function insertAfterBodyOpen(html: string, content: string): string {
  return html.replace(/<body([^>]*)>/i, `<body$1>\n${content}`)
}

function upsertHeadTag(html: string, matcher: RegExp, tag: string): string {
  if (matcher.test(html)) {
    return html.replace(matcher, tag)
  }

  return insertBeforeHeadClose(html, tag)
}

function upsertMetaName(html: string, name: string, content: string): string {
  const namePattern = escapeRegExp(name)

  return upsertHeadTag(
    html,
    new RegExp(
      `<meta\\b(?=[^>]*\\bname=(?:"${namePattern}"|'${namePattern}'|${namePattern})(?=\\s|/|>))[^>]*>`,
      'i',
    ),
    `<meta name="${escapeHtml(name)}" content="${escapeHtml(content)}" />`,
  )
}

function upsertMetaProperty(html: string, property: string, content: string): string {
  const propertyPattern = escapeRegExp(property)

  return upsertHeadTag(
    html,
    new RegExp(
      `<meta\\b(?=[^>]*\\bproperty=(?:"${propertyPattern}"|'${propertyPattern}'|${propertyPattern})(?=\\s|/|>))[^>]*>`,
      'i',
    ),
    `<meta property="${escapeHtml(property)}" content="${escapeHtml(content)}" />`,
  )
}

function upsertCanonical(html: string, canonical: string): string {
  return upsertHeadTag(
    html,
    /<link\b(?=[^>]*\brel=(?:"canonical"|'canonical'|canonical)(?=\s|\/|>))[^>]*>/i,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
  )
}

function upsertJsonLd(html: string, seo: RouteSeo): string {
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: seo.heading,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    url: seo.canonical,
    description: seo.description,
    image: siteImage,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  })
    .replace(/</g, '\\u003C')
    .replace(/>/g, '\\u003E')

  return upsertHeadTag(
    html,
    /<script\s+type=["']application\/ld\+json["']\s+id=["']iconexplorer-ssg-jsonld["'][\s\S]*?<\/script>/i,
    `<script type="application/ld+json" id="iconexplorer-ssg-jsonld">${jsonLd}</script>`,
  )
}

function getRouteSeo(route: SsgRoute): RouteSeo {
  const title = typeof route.meta.title === 'string' ? route.meta.title : `${siteName}`
  const description =
    typeof route.meta.description === 'string' ? route.meta.description : defaultDescription
  const heading = typeof route.meta.heading === 'string' ? route.meta.heading : siteName
  const summary = typeof route.meta.summary === 'string' ? route.meta.summary : defaultDescription
  const canonicalPath = route.path === '/' ? '/' : `${route.path}/`

  return {
    title,
    description,
    canonical: `${siteUrl}${canonicalPath}`,
    heading,
    summary,
  }
}

function createNoScriptSummary(seo: RouteSeo): string {
  return [
    '<noscript>',
    '<section style="max-width: 72rem; margin: 2rem auto; padding: 1rem; font-family: sans-serif; line-height: 1.5;">',
    `<h1>${escapeHtml(seo.heading)}</h1>`,
    `<p>${escapeHtml(seo.summary)}</p>`,
    '<p>Enable JavaScript to search icon sets, preview SVG icons, and copy Quasar-ready imports.</p>',
    '</section>',
    '</noscript>',
  ].join('')
}

export const iconExplorerSsgRoutes: SsgRouteInput[] = [
  {
    path: '/',
    meta: {
      title: `${siteName} | Search Quasar SVG Icons`,
      description: defaultDescription,
      heading: 'Search Quasar SVG icons',
      summary:
        'Icon Explorer helps Quasar developers find SVG icons, compare icon sets, preview paths, and copy import statements for application code.',
    },
  },
  ...iconSets.flatMap((group) =>
    group.children.map((iconSet) => ({
      path: `/icons/${iconSet.value}`,
      params: {
        iconSet: iconSet.value,
      },
      data: {
        label: iconSet.label,
        packageName: iconSet.packageName,
        status: iconSet.status ?? null,
      },
      meta: {
        title: `${iconSet.label} | ${siteName}`,
        description: `Browse ${iconSet.label} in Icon Explorer. Search ${iconSet.packageName} icons, preview SVG paths, and copy Quasar-ready imports.`,
        heading: `${iconSet.label} icons`,
        summary: `Search and preview ${iconSet.label} from ${iconSet.packageName}, then copy the icon name, import statement, inline SVG, or Quasar component snippet.`,
      },
    })),
  ),
]

export const transformIconExplorerSsgHtml: SsgRouteHtmlTransformer = (
  html: string,
  route: SsgRoute,
  _context: SsgRouteRenderContext,
) => {
  const seo = getRouteSeo(route)
  const title = escapeHtml(seo.title)
  let next = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)

  next = upsertMetaName(next, 'description', seo.description)
  next = upsertMetaName(next, 'twitter:card', 'summary_large_image')
  next = upsertMetaName(next, 'twitter:title', seo.title)
  next = upsertMetaName(next, 'twitter:description', seo.description)
  next = upsertMetaName(next, 'twitter:image', siteImage)
  next = upsertMetaProperty(next, 'og:site_name', siteName)
  next = upsertMetaProperty(next, 'og:type', 'website')
  next = upsertMetaProperty(next, 'og:title', seo.title)
  next = upsertMetaProperty(next, 'og:description', seo.description)
  next = upsertMetaProperty(next, 'og:url', seo.canonical)
  next = upsertMetaProperty(next, 'og:image', siteImage)
  next = upsertCanonical(next, seo.canonical)
  next = upsertJsonLd(next, seo)

  return insertAfterBodyOpen(next, createNoScriptSummary(seo))
}
