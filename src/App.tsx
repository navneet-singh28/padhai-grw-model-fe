import { useState } from "react";
import {
  Container,
  Stack,
  Group,
  Title,
  Button,
  Table,
  Loader,
  Text,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

type Metrics = Record<string, number>;

const fakeTable = [
  {
    metric: "Metric 1",
    value: 1.234,
  },
  {
    metric: "Metric 2",
    value: 2.345,
  },
  {
    metric: "Metric 3",
    value: 3.456,
  },
  {
    metric: "Metric 4",
    value: 4.567,
  },
  {
    metric: "Metric 5",
    value: 5.678,
  },
];

export default function App() {
  const [start, setStart] = useState<string | null>("2025-03-01");
  const [end,   setEnd]   = useState<string | null>("2025-04-20");
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const API = import.meta.env.VITE_API_URL;

  async function run() {
    setLoading(true);
    setMetrics(null);
    try {
      const res = await fetch(`${API}/metrics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start,
          end,
          fetch: true,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setMetrics(await res.json());
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Title order={1}>Growth-Model Dashboard</Title>

        <Group wrap="wrap">
          <DateInput
            label="Start"
            value={start}
            onChange={setStart}
            valueFormat="YYYY-MM-DD"
            clearable
          />
          <DateInput
            label="End"
            value={end}
            onChange={setEnd}
            valueFormat="YYYY-MM-DD"
            clearable
          />
          <Button onClick={run} loading={loading} disabled={!start || !end}>
            Run
          </Button>
        </Group>

        {loading && (
          <Group justify="center">
            <Loader />
            <Text>Computing... Might take about a minute</Text>
          </Group>
        )}

        {metrics && (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Metric</Table.Th>
                <Table.Th>Value</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {Object.entries(metrics).map(([k, v]) => (
                <Table.Tr key={k}>
                  <Table.Td>{k}</Table.Td>
                  <Table.Td>{v.toFixed(3)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Stack>
    </Container>
  );
}