import gulp from 'gulp'
import mocha from 'gulp-mocha'
import docco from 'gulp-docco'
import shell from 'gulp-shell'
import babel from 'gulp-babel'

let sourcesDocsFolder = 'sources_docs'
let paths = {
		sources: './sources/*.js',
		tests: [
			'./tests/unit_tests/*.js',
			'./tests/integration_tests/*.js',
			'./tests/performance_tests/*.js'
		]
}

gulp.task('babel', () => {
	let babelConfig = {
		sourceMaps: true,
		presets: ['es2015']
	}
	return gulp.src(paths.sources)
						 .pipe(babel(babelConfig))
						 .pipe(gulp.dest('./compiled'))
})

//This task requires Neo4j server running
gulp.task('tests', ['babel'], () => {
	return gulp.src(paths.tests, {read: false})
		         .pipe(mocha({reporter: 'spec'}))
})

gulp.task('unit_tests', () => {
	return gulp.src([paths.tests[0]], {read: false})
		         .pipe(mocha({reporter: 'spec'}))
})

gulp.task('integration_tests', () => {
	return gulp.src([paths.tests[1]], {read: false})
		         .pipe(mocha({reporter: 'spec'}))
})

gulp.task('docco', () => {
	return gulp.src("./sources/*.js")
		         .pipe(docco())
		         .pipe(gulp.dest('./' + sourcesDocsFolder))
})

gulp.task('ghp', shell.task([
	'git rm -rf ' + sourcesDocsFolder,
	'gulp docco',
	'git add .',
	'git commit -m "updating generated docs"',
	'git checkout gh-pages',
	'git checkout master -- ' + sourcesDocsFolder,
	'git add ' + sourcesDocsFolder,
	'git commit -m "Adding docs from master branch."',
	'git push --force origin gh-pages'
]))
