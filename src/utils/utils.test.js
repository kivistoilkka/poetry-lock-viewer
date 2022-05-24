import '@testing-library/jest-dom'
import parseTOML from './parser'

const mock_file = `
[[package]]
name = "cffi"
version = "1.15.0"
description = "Foreign Function Interface for Python calling C code."
category = "main"
optional = false
python-versions = "*"

[package.dependencies]
pycparser = "*"

[[package]]
name = "pycparser"
version = "2.21"
description = "C parser in Python"
category = "main"
optional = false
python-versions = ">=2.7, !=3.0.*, !=3.1.*, !=3.2.*, !=3.3.*"

[metadata]

`

test('installed packages are saved', () => {
  const packages = parseTOML(mock_file)
  const names = Object.keys(packages)
  expect(names).toHaveLength(2)
  expect(names).toContain('cffi')
  expect(names).toContain('pycparser')
})

test('installed package saves dependecies', () => {
  const packages = parseTOML(mock_file)
  const pckg = packages['cffi']
  expect(pckg.dependencies).toHaveLength(1)
  expect(pckg.dependencies).toContainEqual({
    name: 'pycparser',
    optional: false,
  })
})

test('installed package saves also installed reverse dependencies', () => {
  const packages = parseTOML(mock_file)
  expect(packages['pycparser'].reverseDependencies).toHaveLength(1)
  expect(packages['pycparser'].reverseDependencies).toContain('cffi')
})
