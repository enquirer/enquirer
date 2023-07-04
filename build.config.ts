import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    entries: [{input:'./index.js'}],
    outDir: "./",
    clean: true,
    rollup: {
        resolve: { browser:true },
        inlineDependencies: true
    },
    hooks: {
        'rollup:options'(_, options): void {
            options.external = () => false
        }
    }
})
