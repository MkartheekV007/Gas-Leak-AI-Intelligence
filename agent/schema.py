from enum import Enum
from pydantic import BaseModel, Field

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class AssessmentOutput(BaseModel):
    risk_level: RiskLevel = Field(
        description="The assessed risk level of the gas leak incident."
    )
    reason: str = Field(
        description="A concise explanation of why this risk level was assigned based on the user's description."
    )
    immediate_actions: list[str] = Field(
        description="A list of bullet points detailing the immediate, critical safety steps the user must take right now."
    )
    incident_summary: str = Field(
        description="A brief 1-2 sentence summary of the reported incident, suitable for dispatching to emergency responders."
    )
