# Branches

Each merge must be done via pull request, which has to be approved by another bnh6'er, and then merged by the requester

## feature-*
any devolopment must happen on feature-* branch, for example, feature-automation. These branch must start with name feature-* because the pipelines will be triggered on the pattern "feature-*"
## stagging
whenever a feature is ready, its branch (feature-*) is merged here.
No development should happen here, small bug fixes are acceptable though. For any development, create a feature-* branch from stagging.
This is the default branch
## release
this is the "production" branch and only stagging branch should be merged here. No other pr/change should happen. 

# Build and releases
a build job is composed by a code lint, mocha/chai tests and distribution job.

## feature-*
whenever there is a change on the feature-* branch, it will trigger a automated build that produces an artifact.
## stagging
it also produces artifcats whenver there is a change. Additionally, there is a schedulled nightly job that triggers a build and produces draft-release (aka nigthly build)
##  release
Any change here, triggers a build job that produces a release

# versioning
...


