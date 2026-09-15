class InvariantViolationException(Exception):
    """Raised when a core domain invariant is violated."""
    pass


class SequenceGapException(InvariantViolationException):
    """Raised when a selection round sequence contains gaps or is non-contiguous."""
    pass


class DuplicateRoundNumberException(InvariantViolationException):
    """Raised when an attempt is made to insert a duplicate round number."""
    pass


class ProcessIncompleteException(InvariantViolationException):
    """Raised when a selection process validation fails due to empty or invalid rounds."""
    pass
