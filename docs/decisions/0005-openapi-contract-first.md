# ADR-0005: Contract-first API with mocks
Status: accepted

The frontend codes against an OpenAPI contract and a generated TypeScript client. Until the .NET endpoints exist,
mocks implement the same contract so frontend and backend progress in parallel.
