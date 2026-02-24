import { useContext, useEffect, useRef, useState } from 'react';
import {
  Input,
  Title,
  MultiComboBox,
  MultiComboBoxItem,
  Panel,
  FlexBox,
  Button,
  Label,
  DatePicker,
  AnalyticalTable,
  Text,
  ObjectStatus,
} from '@ui5/webcomponents-react';

import HeaderSection from '../../components/HeaderSection/HeaderSection';
import {
  getAplicaciones,
  getListadoDatosAudotoriaPaginado,
  getProcesos,
} from '../../services/auditoria.service';
import { DetalleAuditoria } from './components/DetalleAuditoria/DetalleAuditoria';
import { aplicaciones, paginacionOffset } from '../../utils/constants';
import { AuditoriaContext } from '@/contexts/AuditoriaContext/AuditoriaContext';
import { LoadingContext } from '@/contexts/LoadingContext/LoadingContext';
import { SnackbarContext } from '@/contexts/SnackbarContext/SnackbarContext';
import NuamButton from '@/components/NuamButton/NuamButton';
import CollapseWithPin from '@/components/CollapseWithPin/CollapseWithPin';

export const Auditoria = () => {
  const [fechaConsulta, setFechaConsulta] = useState<string>();
  const todayString = new Date().toISOString().split('T')[0];
  const {
    tableAuditoria,
    setTableAuditoria,
    oPaginationTableAuditoria,
    setoPaginationTableAuditoria,
    page,
    setPage,
  } = useContext(AuditoriaContext);
  const [dataAuditoria, setDataAuditoria] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listaProcesos, setListaProcesos] = useState([]);
  const [listaAplicaciones, setListaAplicaciones] = useState([]);
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [dialogDetalleAuditoria, setDialogDetalleAuditoria] = useState({
    open: false,
  });
  const [datosDetalleAuditoria, setDatosDetalleAuditoria] = useState({});
  const { setSnackbarState } = useContext(SnackbarContext);
  const initialStateFilters = {
    transaccion: '',
    fechaInicio: '',
    fechaFin: '',
    aplicaciones: [],
    procesos: [],
    estado: [],
    usuarios: [],
  };
  const [optionFilters, setOptionFilters] = useState(initialStateFilters);
  const offset = useRef(paginacionOffset);
  const onLoadMore = () => {
    const paginaRevisa = page + 1;
    if (paginaRevisa <= oPaginationTableAuditoria.totalPages) {
      setPage(paginaRevisa);

      setIsLoading(true);
    }
  };

  const { setLoadingState } = useContext(LoadingContext);

  useEffect(() => {
    if (isLoading != null) {
      if (isLoading) {
        setLoadingState(true);
        setTimeout(() => {
          getAuditoria(page);
          setIsLoading(false);
        }, 1000);
      }
    }
  }, [isLoading, tableAuditoria, page]);

  const filtrarLista = () => {
    setIsLoading(true);

    setoPaginationTableAuditoria({
      currentPage: 1,
      perPage: paginacionOffset,
      totalItems: 0,
      totalPages: 1,
    });
    setTableAuditoria([]);
    setPage(1);
  };

  const headers: any = [
    {
      Header: (
        <Text className='tw-text-left tw-pl-2 tw-text-[14px] tw-font-bold '>
          Id Transacción
        </Text>
      ),
      accessor: 'idTransaccion',
      Cell: ({ cell }) => (
        <div className='tw-w-full tw-text-left tw-pl-2  tw-whitespace-normal tw-break-words'>
          {cell.value}
        </div>
      ),
      minWidth: 250,
    },
    {
      Header: (
        <Text className='tw-text-left tw-pl-2 tw-text-[14px] tw-font-bold '>Fecha</Text>
      ),
      accessor: 'createdAt',
      Cell: ({ cell }) => (
        <div className='tw-w-full tw-text-left tw-pl-2  tw-whitespace-normal tw-break-words'>
          {cell.value ? new Date(cell.value).toLocaleString('es-ES') : ''}
        </div>
      ),
      minWidth: 150,
    },
    {
      Header: (
        <Text className='tw-text-left tw-pl-2 tw-text-[14px] tw-font-bold'>Usuario</Text>
      ),
      accessor: 'usuario',
      Cell: ({ cell }) => (
        <div className='tw-w-full tw-text-left tw-pl-2'>{cell.value}</div>
      ),
      minWidth: 250,
    },
    {
      Header: (
        <Text className='tw-text-left tw-pl-2 tw-text-[14px] tw-font-bold'>
          Aplicación
        </Text>
      ),
      accessor: 'aplicacion',
      Cell: ({ cell }) => (
        <div className='tw-w-full tw-text-left tw-pl-2'>{cell.value}</div>
      ),
      minWidth: 250,
    },
    {
      Header: (
        <Text className='tw-text-left tw-pl-2 tw-text-[14px] tw-font-bold'>Method</Text>
      ),
      accessor: 'methodEnvio',
      maxWidth: 120,
      Cell: ({ cell }) => (
        <div className='tw-w-full tw-text-left tw-pl-2'>{cell.value}</div>
      ),
    },
    {
      Header: (
        <Text className='tw-text-left tw-pl-2 tw-text-[14px] tw-font-bold'>Proceso</Text>
      ),
      accessor: 'nombreProceso',
      Cell: ({ cell }) => (
        <div className='tw-w-full tw-text-left tw-pl-2 tw-whitespace-normal tw-break-words'>
          {cell.value}
        </div>
      ),
      minWidth: 400,
    },
    {
      Header: (
        <Text className='tw-text-left tw-pl-2 tw-text-[14px] tw-font-bold'>Tiempo</Text>
      ),
      accessor: 'tiempoProceso',
      Cell: ({ cell }) => (
        <div className='tw-w-full tw-text-left tw-pl-2'>{cell.value} ms</div>
      ),
      width: 100,
      maxWidth: 100,
    },
    {
      Header: (
        <Text className='tw-text-left tw-pl-2 tw-text-[14px] tw-font-bold'>Estado</Text>
      ),
      accessor: 'idEstado',
      width: 100,
      Cell: ({ cell }) => {
        const state = {
          1: 'Positive',
          2: 'Critical',
          3: 'Negative',
        };

        const message = {
          1: 'Ok',
          2: 'Alerta',
          3: 'Error',
        };
        return (
          <ObjectStatus
            className='tw-w-full tw-text-left tw-pl-2'
            showDefaultIcon
            state={state[cell.value]}
          >
            <p className='tw-w-full tw-text-left tw-pl-1'>{message[cell.value]}</p>
          </ObjectStatus>
        );
      },

      maxWidth: 200,
    },
    {
      disableSortBy: true,
      id: 'actions',
      maxWidth: 100,
      Cell: ({ cell }) => {
        return (
          <div className='tw-w-full tw-flex tw-justify-center'>
            <NuamButton
              variant='secondary'
              icon='show'
              round={true}
              onClick={() => selectRowAuditoriaInfo(cell)}
            />
          </div>
        );
      },
    },
  ];

  const selectRowAuditoriaInfo = cell => {
    setDatosDetalleAuditoria(cell.row.original);
    setDialogDetalleAuditoria({ open: true });
  };

  const handleFiltrosBusqueda = e => {
    const { name, value } = e.target;
    const filtros = Object.assign({}, optionFilters);
    filtros[name] = value;
    setOptionFilters(filtros);
  };

  const formatearFecha = (fecha: string | Date): string => {
    const date = new Date(fecha);
    const formato = new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);

    return formato.replace(',', '');
  };

  const handleChangeComboBox = (event: any) => {
    const { name } = event.target;
    const selectedValues = event.detail.items.map((item: any) => item.dataset.cod);
    setOptionFilters(prev => ({ ...prev, [name]: selectedValues }));
  };

  const getProcess = async () => {
    const process = await getProcesos();

    const processTransform = process.listaProcesos.map(el => {
      return {
        label: el.nombre_proceso,
        value: el.nombre_proceso,
      };
    });
    setListaProcesos(processTransform);
  };

  const getUsuarios = async () => {
    // TODO: Implementar getListadoUsuarios cuando exista el endpoint
    // Por ahora, lista vacía
    setListaUsuarios([]);
  };

  const getApp = async () => {
    const apps = await getAplicaciones();
    const appTransform = apps.listaAplicaciones.map(el => {
      return {
        label: el.aplicacion,
        value: el.aplicacion,
      };
    });
    setListaAplicaciones(appTransform);
  };

  const getAuditoria = async (pagina: number) => {
    //
    // const data = await getListadoDatosAudotoriaPaginado({
    //   page: pagina,
    //   perPage: paginacionOffset,
    //   filtro: optionFilters,
    // });

    // const dataTransformada = data.obtenerAuditoriaCabecera.map((item: any) => ({
    //   ...item,
    //   fecha_transaccion: formatearFecha(item.fecha_transaccion),
    // }));
    // console.log(dataTransformada);
    // setDataAuditoria(prev => [...prev, ...dataTransformada]);

    try {
      const response = await getListadoDatosAudotoriaPaginado({
        page: pagina,
        perPage: paginacionOffset,
        filtro: optionFilters,
      });

      if (response.results.oData.length == 0) {
        setSnackbarState('Alerta!', 'No se encontraron registros.', 'WARNING');
        return;
      }
      // setOPagination(respDatosGarantiaPaginado.results.oPagination);
      // setDataGarantia((prev) => [...prev, ...respDatosGarantiaPaginado.results.oData]);

      setoPaginationTableAuditoria(response.results.oPagination);
      let copyTableAuditoria = [...tableAuditoria];
      copyTableAuditoria = [...copyTableAuditoria, ...response.results.oData];

      setTableAuditoria(copyTableAuditoria);
    } catch (error) {
      setSnackbarState('Error!', 'Ocurrió un error en el servicio.', 'ERROR');
    } finally {
      setLoadingState(false);
    }
  };

  // const filtrarLista = () => {
  //   console.log(optionFilters);
  //   setDataAuditoria([]);
  //   getAuditoria(1, optionFilters);
  // };

  useEffect(() => {
    getProcess();
    getApp();
    filtrarLista();
    getUsuarios();
  }, []);

  const comboBoxItems = [
    { text: 'Ok', cod: 1 },
    { text: 'Alerta', cod: 2 },
    { text: 'Error', cod: 3 },
  ];

  useEffect(() => {
    const headerSection = document.getElementById('header-section');
    const tableHeaderSection = document.getElementById('table-header-section');
    const tableContainerSection = document.getElementById('table-container');

    if (!headerSection || !tableHeaderSection) return;

    const updateHeight = () => {
      const headerHeight = headerSection.offsetHeight;
      const tableHeaderHeight = tableHeaderSection.offsetHeight;
      const margin = 60;
      const availableHeight =
        window.innerHeight - headerHeight - tableHeaderHeight - margin - 88;
      setTableHeight(`${availableHeight}px`);
      const rowHeight = 60;

      const calculatedRows = availableHeight / rowHeight - 1;

      setDynamicRows(calculatedRows);
    };

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(headerSection);
    resizeObserver.observe(tableHeaderSection);
    resizeObserver.observe(document.body);

    updateHeight();
    // window.addEventListener('resize', updateHeight);
    // return () => window.removeEventListener('resize', updateHeight);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const [tableHeight, setTableHeight] = useState('auto');
  const [dynamicRows, setDynamicRows] = useState(0); // Default

  return (
    <div style={{ position: 'relative' }}>
      <div id='header-section'>
        <HeaderSection title='Auditoría' principal={true}>
          <CollapseWithPin
            storageKey='auditoria-filters'
            className='tw-pb-2'
            defaultOpen={true}
          >
            {fechaConsulta && (
              <div className='tw-mb-4 tw-text-sm tw-text-slate-600'>
                Última consulta: {fechaConsulta}
              </div>
            )}

            <div className='tw-flex tw-row-auto'>
              <div className='tw-flex tw-flex-wrap tw-gap-4 tw-mb-4 tw-w-full'>
                <div className='tw-flex tw-flex-col tw-w-full sm:tw-w-[260px]'>
                  <Label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block' }}>Fecha Inicio</Label>
                  <DatePicker
                    formatPattern='dd/MM/YYYY'
                    onChange={handleFiltrosBusqueda}
                    name='fechaInicio'
                    valueState='None'
                    maxDate={todayString}
                    value={optionFilters.fechaInicio}
                    placeholder='Ingrese'
                  />
                </div>

                <div className='tw-flex tw-flex-col tw-w-full sm:tw-w-[260px]'>
                  <Label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block' }}>Fecha Fin</Label>
                  <DatePicker
                    formatPattern='dd/MM/YYYY'
                    onChange={handleFiltrosBusqueda}
                    name='fechaFin'
                    maxDate={todayString}
                    valueState='None'
                    value={optionFilters?.fechaFin || ''}
                    placeholder='Ingrese'
                  />
                </div>

                <div className='tw-flex tw-flex-col tw-w-full sm:tw-w-[260px]'>
                  <Label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block' }}>Transacción</Label>
                  <Input
                    className='tw-w-full'
                    placeholder='Ingrese'
                    name='transaccion'
                    onChange={handleFiltrosBusqueda}
                    value={optionFilters.transaccion}
                  />
                </div>

                <div className='tw-flex tw-flex-col tw-w-full sm:tw-w-[260px]'>
                  <Label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block' }}>Aplicaciones</Label>
                  <MultiComboBox
                    showSelectAll={true}
                    className='tw-w-full'
                    onSelectionChange={handleChangeComboBox}
                    onChange={function ks() {}}
                    onClose={function ks() {}}
                    onInput={function ks() {}}
                    onOpen={function ks() {}}
                    valueState='None'
                    name='aplicaciones'

                    // value={optionFilters.aplicaciones}
                  >
                    {listaAplicaciones.map(item => (
                      <MultiComboBoxItem
                        key={item.value}
                        text={item.label}
                        data-cod={item.value} // Attach the 'cod' value as a data attribute
                        selected={optionFilters.aplicaciones.includes(item.value)}
                      />
                    ))}
                  </MultiComboBox>
                </div>

                <div className='tw-flex tw-flex-col tw-w-full sm:tw-w-[260px]'>
                  <Label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block' }}>Usuarios</Label>
                  <MultiComboBox
                    showSelectAll={true}
                    className='tw-w-full'
                    onSelectionChange={handleChangeComboBox}
                    onChange={function ks() {}}
                    onClose={function ks() {}}
                    onInput={function ks() {}}
                    onOpen={function ks() {}}
                    valueState='None'
                    name='usuarios'
                    // value={optionFilters.aplicaciones}
                  >
                    {listaUsuarios.map(item => (
                      <MultiComboBoxItem
                        key={item.value}
                        text={item.label}
                        data-cod={item.value} // Attach the 'cod' value as a data attribute
                        selected={optionFilters.usuarios.includes(item.value)}
                      />
                    ))}
                  </MultiComboBox>
                </div>

                <div className='tw-flex tw-flex-col tw-w-full sm:tw-w-[260px]'>
                  <Label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block' }}>Procesos</Label>
                  <MultiComboBox
                    showSelectAll={true}
                    className='tw-w-full'
                    onSelectionChange={handleChangeComboBox}
                    onChange={function ks() {}}
                    onClose={function ks() {}}
                    onInput={function ks() {}}
                    onOpen={function ks() {}}
                    valueState='None'
                    name='procesos'
                    // value={optionFilters.procesos}
                  >
                    {listaProcesos.map(item => (
                      <MultiComboBoxItem
                        key={item.value}
                        text={item.label}
                        data-cod={item.value} // Attach the 'cod' value as a data attribute
                        selected={optionFilters.procesos.includes(item.value)}
                      />
                    ))}
                  </MultiComboBox>
                </div>

                <div className='tw-flex tw-flex-col tw-w-full sm:tw-w-[260px]'>
                  <Label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block' }}>Estado</Label>
                  <MultiComboBox
                    className='tw-w-full'
                    showSelectAll={true}
                    onSelectionChange={handleChangeComboBox}
                    onChange={function ks() {}}
                    onClose={function ks() {}}
                    onInput={function ks() {}}
                    onOpen={function ks() {}}
                    valueState='None'
                    name='estado'
                    // value={optionFilters.estado}
                  >
                    {comboBoxItems.map(item => (
                      <MultiComboBoxItem
                        key={item.cod}
                        text={item.text}
                        data-cod={item.cod} // Attach the 'cod' value as a data attribute
                        selected={optionFilters.estado.includes(item.cod)}
                      />
                    ))}
                  </MultiComboBox>
                </div>
              </div>

              <div className='tw-ml-4 tw-pb-5 tw-flex'>
                <div className='tw-flex tw-w-full tw-justify-end tw-items-end tw-gap-3'>
                  <NuamButton
                    variant='secondary'
                    icon='search'
                    onClick={() => {
                      setFechaConsulta(new Date().toLocaleString('es-ES'));
                      filtrarLista();
                    }}
                    className='!tw-bg-white !tw-text-[#0070f2] !tw-border-white !tw-shadow-md hover:!tw-shadow-lg'
                    style={{ minWidth: '110px' }}
                  >
                    Buscar
                  </NuamButton>

                  <NuamButton
                    variant='secondary'
                    icon='clear-filter'
                    onClick={() => {
                      setOptionFilters(initialStateFilters);
                    }}
                    className='!tw-bg-white !tw-text-[#0070f2] !tw-border-white !tw-shadow-md hover:!tw-shadow-lg'
                    style={{ minWidth: '110px' }}
                  >
                    Limpiar
                  </NuamButton>
                </div>
              </div>
            </div>
          </CollapseWithPin>
        </HeaderSection>
      </div>

      <div id='table-header-section' className='w-full h-auto px-4'>
        <div className='tw-flex'>
          <div className='tw-w-[200px]  tw-font-semibold'>
            Transacciones (
            {oPaginationTableAuditoria ? oPaginationTableAuditoria.totalItems : '0'})
          </div>
        </div>
      </div>
      <div className='tw-px-4' style={{ height: tableHeight }}>
        <AnalyticalTable
          headerRowHeight={60}
          id='table-container'
          columns={headers}
          data={tableAuditoria}
          infiniteScroll={true}
          highlightField='status'
          infiniteScrollThreshold={5}
          loading={isLoading}
          onLoadMore={onLoadMore}
          visibleRows={dynamicRows}
          style={{ height: '100%', overflow: 'auto' }}
        />
      </div>

      {dialogDetalleAuditoria.open && (
        <DetalleAuditoria
          dialogDetalleAuditoria={dialogDetalleAuditoria}
          setDialogDetalleAuditoria={setDialogDetalleAuditoria}
          datosAuditoria={datosDetalleAuditoria}
        />
      )}
    </div>
  );

  return (
    <div className='h-max'>
      <div className='w-full px-4'>
        {/* <Panel
          collapsed
          header={
            <FlexBox alignItems="Center" fitContainer style={{ gap: '0.25rem' }}>
              <Title level="H2">Filtros</Title>
              <span style={{ flexGrow: 1 }} />
              <Button onClick={filtrarLista} design="Emphasized">
                Buscar
              </Button>
            </FlexBox>
          }
          headerText="Panel"
          onToggle={function ks() {}}
        ></Panel> */}
      </div>
    </div>
  );
};
