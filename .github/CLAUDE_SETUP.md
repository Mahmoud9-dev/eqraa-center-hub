# Claude GitHub Integration Setup Guide

This repository is configured with automated code reviews and AI assistance using Claude Code.

## 🚀 Setup Instructions

### Step 1: Install the Claude GitHub App

1. Visit [https://github.com/apps/claude](https://github.com/apps/claude)
2. Click "Install" or "Configure"
3. Select this repository (`eqraa-center-hub-1`)
4. Grant the following permissions:
   - **Contents**: Read & write
   - **Issues**: Read & write
   - **Pull requests**: Read & write

### Step 2: Add Your Anthropic API Key

1. Go to [https://console.anthropic.com](https://console.anthropic.com) and get your API key
2. Navigate to your repository Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `ANTHROPIC_API_KEY`
5. Value: Your API key from Anthropic Console
6. Click "Add secret"

### Step 3: Verify Workflows

The repository now has two Claude-powered workflows:

- **`.github/workflows/claude-code-review.yml`** - Automated code reviews on PRs
- **`.github/workflows/claude.yml`** - Interactive Claude assistant

No additional configuration needed - they're ready to use!

## 📋 Available Workflows

### 1. Automated Code Review (`claude-code-review.yml`)

**Triggers automatically on:**
- New pull requests
- PR updates (new commits)
- Comments mentioning `@claude` in PRs

**Features:**
- Runs type checking, linting, and tests
- Automatically categorizes changed files by type
- Provides **file-type specific code review** with specialized focus areas
- Comprehensive analysis covering all aspects of code quality and security

**File-Type Specific Review Rules:**

1. **Type Safety Focus** (`*.ts` files in `/src/lib/`, `/src/types/`, `/src/hooks/`)
   - ✅ Type safety (no `any` types)
   - ✅ Proper interface/type definitions
   - ✅ Generic type usage
   - ✅ Utility types (Partial, Pick, Omit)
   - ✅ Null/undefined handling

2. **Security & Database Focus** (files with `supabase.*` calls - `/src/pages/*.tsx`, components)
   - 🔒 Security validation before database operations
   - 🔒 Comprehensive error handling
   - 🔒 SQL injection prevention
   - 🔒 Authentication & authorization checks
   - 🔒 Data sanitization
   - 🔒 Query optimization

3. **Validation Schema Focus** (`/src/lib/validations.ts`)
   - ✅ Comprehensive Zod schemas
   - ✅ Security validation (XSS, SQL injection patterns)
   - ✅ Input sanitization
   - ✅ Clear error messages

4. **Authentication Focus** (Login, Signup, ProtectedRoute, useUserRole)
   - 🔐 Secure authentication flow
   - 🔐 Session management
   - 🔐 Role-based access control
   - 🔐 Token handling security

**Review Categories:**
- 🎯 **File-Type Specific Findings** - Organized by file category
- 🔴 **Critical Issues** - Must fix before merge
- ⚠️ **Warnings** - Should address
- 💡 **Suggestions** - Nice-to-have improvements
- ✅ **Positive Highlights** - What was done well

### 2. Interactive Claude Assistant (`claude.yml`)

**Activation methods:**

**Method 1: Comment mention**
```
@claude please help me refactor this component
```

**Method 2: Labels**
Add the `claude` label to any issue or PR

**Use cases:**
- Code refactoring suggestions
- Bug investigation
- Implementation guidance
- Documentation generation
- Test writing assistance

## 💡 Usage Examples

### Example 1: Get Automated Review
Simply open a PR - Claude will automatically review it within minutes.

### Example 2: Ask for Specific Help
In a PR comment:
```
@claude can you suggest how to optimize the performance of the StudentList component?
```

### Example 3: Request Code Changes
In an issue:
```
@claude please add error handling to the authentication flow in src/auth/login.ts
```

### Example 4: Generate Tests
In a PR comment:
```
@claude can you write unit tests for the new validation functions?
```

## 🎯 How File-Type Specific Reviews Work

The workflow automatically categorizes changed files based on their location and purpose:

### Categorization Logic

**Type Safety Files:**
- Pattern: `src/lib/*.ts`, `src/types/*.ts`, `src/hooks/*.ts`
- Excludes: `*.test.ts`, `*.spec.ts`
- Focus: TypeScript type safety and proper interface usage

**Supabase/Database Files:**
- Pattern: `src/pages/**/*.tsx`, `src/components/**/*.tsx`, files with `supabase` in path
- Focus: Security validation and error handling for database operations

**Validation Files:**
- Pattern: `src/lib/validations.ts`
- Focus: Comprehensive input validation and security

**Authentication Files:**
- Pattern: Files matching `Login`, `Signup`, `ProtectedRoute`, `useUserRole`
- Focus: Authentication and authorization security

### Example Review Output

When you create a PR that modifies:
- `src/lib/utils.ts` → Gets Type Safety review
- `src/pages/Students.tsx` → Gets Security & Database review
- `src/lib/validations.ts` → Gets Validation Schema review
- `src/components/ProtectedRoute.tsx` → Gets Authentication review

The review will have dedicated sections for each file type with specialized findings.

## 🔒 Security Considerations

The workflows check for:
- XSS vulnerabilities
- SQL injection risks (Supabase queries)
- Authentication/authorization issues
- Sensitive data exposure
- OWASP Top 10 vulnerabilities
- Input validation and sanitization
- Secure token handling

## 🎯 Project-Specific Review Focus

Claude is configured to review based on your tech stack:
- **Frontend**: React 18, TypeScript, Vite
- **UI**: Radix UI, Tailwind CSS, shadcn/ui
- **Forms**: react-hook-form + Zod validation
- **State**: TanStack Query
- **Backend**: Supabase
- **Testing**: Vitest, Playwright, Testing Library

## 📊 Review Artifacts

Each review generates logs that are stored as GitHub artifacts:
- `type-check.log` - TypeScript compilation results
- `lint.log` - ESLint results
- `test.log` - Test execution results

Access them in the workflow run under "Artifacts".

## 🔧 Customization

### Modify Review Criteria

Edit `.github/workflows/claude-code-review.yml` and update the `prompt` section to adjust review focus areas.

### Change Trigger Conditions

Edit the `on:` section in either workflow file:

```yaml
on:
  pull_request:
    types: [opened, synchronize]
    branches: [main, develop]  # Add specific branches
```

### Add Custom Labels

Edit `.github/workflows/claude.yml` to use different label names:

```yaml
if: contains(github.event.issue.labels.*.name, 'ai-review')
```

## 🐛 Troubleshooting

### Claude doesn't respond
1. Check that `ANTHROPIC_API_KEY` secret is set correctly
2. Verify the GitHub App is installed with proper permissions
3. Check workflow run logs in Actions tab

### Review is incomplete
1. Ensure all required permissions are granted
2. Check if the API key has sufficient credits
3. Verify the PR has actual code changes

### Workflow fails
1. Check the Actions tab for detailed error logs
2. Verify Node.js dependencies install correctly
3. Ensure test scripts are working locally

## 📚 Additional Resources

- [Claude Code Documentation](https://code.claude.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Claude Code Action Repository](https://github.com/anthropics/claude-code-action)

## 🤝 Best Practices

1. **Use descriptive PR titles** - Helps Claude understand the context
2. **Keep PRs focused** - Smaller PRs get better reviews
3. **Add PR descriptions** - Provide context for the changes
4. **Respond to reviews** - Engage with Claude's suggestions
5. **Use labels** - Organize issues and PRs with relevant labels

## ⚠️ Limitations

- Claude reviews are advisory - human review is still recommended
- Complex architectural decisions may need human judgment
- API rate limits apply based on your Anthropic plan
- Large PRs (>50 files) may get truncated reviews

## 📝 Notes

- Reviews typically complete within 2-5 minutes
- Claude maintains context across multiple comments in the same thread
- You can ask follow-up questions by mentioning `@claude` again
- The system respects your existing CI/CD workflows and runs in parallel

---

**Last Updated**: 2025-11-24
**Workflow Version**: 1.0
