// CSS modules — Next.js handles these at build time; declare for tsc
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}
