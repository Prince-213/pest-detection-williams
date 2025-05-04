import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Column,
  Row,
  Img
} from "@react-email/components";
import * as React from "react";
import { render } from "@react-email/render";

interface PestAlertEmailProps {
  pest: string;
  confidence: number;
  detectionDate?: string;
  farmLocation?: string;
  recommendedActions?: string[];
}

export const PestAlertEmail = ({
  pest,
  confidence,
  detectionDate = new Date().toLocaleDateString(),
  farmLocation = "your farm",
  recommendedActions = [
    "Isolate affected plants immediately",
    "Apply organic pesticide treatment",
    "Monitor surrounding plants for signs of infestation",
    "Contact agricultural extension officer for consultation"
  ]
}: PestAlertEmailProps) => (
  <Html>
    <Head />
    <Preview>
      🚨 Pest Alert: {pest} detected with {confidence.toString()}% confidence
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <div style={headerContent}>
            <Img
              src="https://img.icons8.com/?size=100&id=NOIALyDZ7TWC&format=png&color=000000" // Replace with your logo
              width="48"
              height="48"
              alt="Pest Alert Logo"
              style={logo}
            />
            <Text style={headerTitle}>Farm Pest Detection Alert</Text>
          </div>
        </Section>

        <Section style={alertSection}>
          <Text style={alertTitle}>
            🚨 {pest.toUpperCase()} DETECTED ON YOUR FARM 🚨
          </Text>

          <Row style={row}>
            <Column style={leftColumn}>Pest Detected:</Column>
            <Column style={rightColumn}>
              <strong>{pest}</strong>
            </Column>
          </Row>

          <Row style={row}>
            <Column style={leftColumn}>Confidence Level:</Column>
            <Column style={rightColumn}>
              <strong>{confidence}%</strong>
              <div style={confidenceBarContainer}>
                <div
                  style={{
                    ...confidenceBar,
                    width: `${confidence}%`,
                    backgroundColor:
                      confidence > 70
                        ? "#D32F2F"
                        : confidence > 40
                          ? "#FB8C00"
                          : "#FFA000"
                  }}
                />
              </div>
            </Column>
          </Row>

          <Row style={row}>
            <Column style={leftColumn}>Detection Date:</Column>
            <Column style={rightColumn}>
              <strong>{detectionDate}</strong>
            </Column>
          </Row>

          <Row style={row}>
            <Column style={leftColumn}>Location:</Column>
            <Column style={rightColumn}>
              <strong>{farmLocation}</strong>
            </Column>
          </Row>

          <Section style={warningSection}>
            <Text style={warningTitle}>⚠️ Immediate Action Required</Text>
            <Text style={warningText}>
              Early intervention is crucial to prevent widespread damage to your
              crops.
            </Text>
          </Section>

          <Section style={recommendationsSection}>
            <Text style={sectionTitle}>Recommended Actions:</Text>
            <ul style={list}>
              {recommendedActions.map((action, index) => (
                <li key={index} style={listItem}>
                  <Text style={listText}>{action}</Text>
                </li>
              ))}
            </ul>
          </Section>

          <Section style={resourcesSection}>
            <Text style={sectionTitle}>Additional Resources:</Text>
            <Text style={resourcesText}>
              Learn more about {pest} and effective control methods:
            </Text>
            <a
              href={`https://example.com/pest-control/${pest.toLowerCase().replace(/\s+/g, "-")}`}
              style={resourceLink}
            >
              {pest} Control Guide
            </a>
          </Section>

          <Section style={actionSection}>
            <Text style={actionText}>
              View detailed report and treatment options:
            </Text>
            <a href="https://yourfarmportal.com/alerts" style={actionButton}>
              VIEW FULL REPORT
            </a>
          </Section>
        </Section>

        <Text style={footer}>
          FarmProtect Alerts • {new Date().getFullYear()}
          <br />
          This is an automated notification. To adjust alert preferences, visit
          your account settings.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default PestAlertEmail;

export const renderPestAlertEmail = async (props: PestAlertEmailProps) =>
  await render(<PestAlertEmail {...props} />);

// Styles
const main = {
  backgroundColor: "#f5f5f5",
  color: "#333333",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "20px 0 30px"
};

const header = {
  backgroundColor: "#4CAF50",
  padding: "20px",
  textAlign: "center" as const,
  marginBottom: "20px",
  borderRadius: "8px 8px 0 0"
};

const headerContent = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px"
};

const logo = {
  margin: "0 auto"
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0"
};

const alertSection = {
  backgroundColor: "#ffffff",
  padding: "25px",
  borderRadius: "0 0 8px 8px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
};

const alertTitle = {
  color: "#D32F2F",
  fontSize: "22px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0 0 20px 0",
  paddingBottom: "15px",
  borderBottom: "1px solid #eeeeee"
};

const row = {
  margin: "15px 0",
  display: "flex",
  width: "100%"
};

const leftColumn = {
  width: "30%",
  fontWeight: "bold",
  paddingRight: "10px",
  color: "#616161"
};

const rightColumn = {
  width: "70%"
};

const confidenceBarContainer = {
  width: "100%",
  backgroundColor: "#e0e0e0",
  borderRadius: "4px",
  marginTop: "5px"
};

const confidenceBar = {
  height: "8px",
  borderRadius: "4px",
  transition: "width 0.3s ease"
};

const warningSection = {
  backgroundColor: "#FFF3E0",
  padding: "15px",
  borderRadius: "5px",
  margin: "20px 0",
  borderLeft: "4px solid #FFA000"
};

const warningTitle = {
  fontWeight: "bold",
  color: "#E65100",
  marginBottom: "10px",
  fontSize: "16px"
};

const warningText = {
  margin: "0",
  lineHeight: "1.5",
  color: "#E65100"
};

const recommendationsSection = {
  backgroundColor: "#E8F5E9",
  padding: "15px",
  borderRadius: "5px",
  margin: "20px 0"
};

const sectionTitle = {
  fontWeight: "bold",
  marginBottom: "10px",
  fontSize: "16px",
  color: "#2E7D32"
};

const list = {
  paddingLeft: "20px",
  margin: "10px 0"
};

const listItem = {
  marginBottom: "8px"
};

const listText = {
  margin: "0",
  lineHeight: "1.5"
};

const resourcesSection = {
  backgroundColor: "#E3F2FD",
  padding: "15px",
  borderRadius: "5px",
  margin: "20px 0",
  borderLeft: "4px solid #1976D2"
};

const resourcesText = {
  margin: "0 0 10px 0",
  lineHeight: "1.5"
};

const resourceLink = {
  color: "#1976D2",
  textDecoration: "underline",
  fontWeight: "bold"
};

const actionSection = {
  textAlign: "center" as const,
  margin: "25px 0 10px 0"
};

const actionText = {
  fontWeight: "bold",
  color: "#2E7D32",
  marginBottom: "15px"
};

const actionButton = {
  backgroundColor: "#4CAF50",
  color: "#ffffff",
  padding: "12px 25px",
  borderRadius: "4px",
  textDecoration: "none",
  fontWeight: "bold",
  display: "inline-block"
};

const footer = {
  color: "#757575",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "30px",
  lineHeight: "1.5"
};
